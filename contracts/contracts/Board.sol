// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Elo} from "./library/Elo.sol";
import {fiveoutofnineART, Chess} from "./art/fiveOutOfNineArt.sol";

contract Board is ERC721, Ownable{
    uint256 constant TOKEN_PRICE = 0.02 ether; // Token price of minting an NFT for a solved puzzle
    uint256 constant CREATOR_SPLIT = 15; // Percent of token price that goes to creator (e.g. 15 = 15%)
    uint256 constant K_FACTOR = 25e18; //  How quickly elo is adjusted
    uint256 constant RATING_FLOOR = 100e18; // Minimum rating a person or puzzle can have
    uint16 public puzzleCounter;
    uint256 public tokenCount; 

    struct Puzzle {
        string fen;
        bytes32 solutionHash; // Hash of the solution
        uint256 solveCount; 
        uint256 attemptCount; 
        mapping(address => bool) userHasSolved;
        mapping(address => bool) userHasAttempted;
        uint256 rating;
        Chess.Move move; // Used to generate nft art
        address creator ;
    }


    mapping(uint16 => Puzzle) public puzzlesById;
    mapping(address => uint256 ) public userRatings;
    mapping(uint256 => uint16) public tokenIdToPuzzleId;

    error StringCannotBeEmpty(string s);
    error BytesCannotBeEmpty(bytes32 b);
    error InvalidPuzzle(uint16 puzzleId );
    error AlreadyAttempted(uint16 puzzleId);
    error PuzzleNotSolved(uint16 puzzleId);
    error TokenDoesNotExist(uint256 tokenId);
    error NotEnoughEtherSent(uint256 amountSent, uint256 requiredAmount);
    error InvalidPuzzleMove(uint16 puzzleId);

    constructor(address initialOwner ,string memory name, string memory symbol) Ownable(initialOwner) ERC721(name, symbol) {}

    function userHasSolvedPuzzle(uint16 puzzleId, address user) public view returns (bool) {
        return puzzlesById[puzzleId].userHasSolved[user];
    }

    function tokenURI(uint256 _tokenId) public view override returns (string memory) {
        if(_tokenId >= tokenCount){
            revert TokenDoesNotExist(_tokenId);

        }
        return fiveoutofnineART.getMetadata(_tokenId, puzzlesById[tokenIdToPuzzleId[_tokenId]].move);
    }


    function mint(uint16 puzzleId) public payable{
        if(msg.value < TOKEN_PRICE){
            revert NotEnoughEtherSent(msg.value, TOKEN_PRICE);
        }
        Puzzle storage puzzle =puzzlesById[puzzleId];
        if(!puzzle.userHasSolved[_msgSender()]){
            revert PuzzleNotSolved(puzzleId);
        }

        tokenIdToPuzzleId[tokenCount] = puzzleId;
        tokenCount++;
        _mint(_msgSender(), tokenCount);
        payable(puzzle.creator).transfer(msg.value* CREATOR_SPLIT / 100);
    }

    function addPuzzle(string memory fen, bytes32 solutionHash, Chess.Move memory move) public{
        if(bytes(fen).length == 0){
            revert StringCannotBeEmpty(fen);
        }
        if((solutionHash).length ==0){
            revert BytesCannotBeEmpty(solutionHash);
        } 
        if(move.board ==0 || move.metadata==0){
            revert InvalidPuzzleMove(puzzleCounter);
        }

        // Call to ensure that getMetadata is valid
        fiveoutofnineART.getMetadata(puzzleCounter, move);

        uint16 puzzleId = puzzleCounter;
        Puzzle storage puzzle = puzzlesById[puzzleId];
        puzzle.fen = fen;
        puzzle.solutionHash = solutionHash;
        puzzle.creator = _msgSender();
        puzzle.rating = 1000e18;
        puzzle.move = move;
        puzzleCounter = puzzleCounter + 1;
    }

    function submitSolution(uint16 puzzleId, bytes memory solution) public returns (bool) {
        if(puzzleId >= puzzleCounter){
            revert InvalidPuzzle(puzzleId);
        }

        Puzzle storage puzzle = puzzlesById[puzzleId];

        if(puzzle.userHasAttempted[_msgSender()]){
            revert AlreadyAttempted(puzzleId);
        }

        puzzle.userHasAttempted[_msgSender()] = true;
        puzzle.attemptCount += 1;

        // cache ratings for gas savings
        uint256 userRating  = userRatings[_msgSender()];
        uint256 puzzleRating = puzzle.rating; 

        if (puzzle.solutionHash == keccak256(solution)) {
            puzzle.userHasSolved[_msgSender()] = true;
            puzzle.solveCount += 1;
            (uint256 ratingAdjustment, ) = Elo.calculateEloUpdate(userRating, puzzleRating, 1e18, K_FACTOR);
            userRatings[_msgSender()] = userRating + ratingAdjustment;
            if(puzzleRating > RATING_FLOOR + ratingAdjustment){
                puzzle.rating = puzzleRating - ratingAdjustment;
            }
            else{
                puzzle.rating = RATING_FLOOR; // Ratings flooor
            }
            return true;
        } else {
            (uint256 ratingAdjustment, ) = Elo.calculateEloUpdate(userRating, puzzleRating, 0, K_FACTOR);
            puzzleRating = puzzleRating + ratingAdjustment;
            if(userRating > RATING_FLOOR + ratingAdjustment){
                userRatings[_msgSender()] = userRating - ratingAdjustment;
            }
            else{
                userRatings[_msgSender()] = RATING_FLOOR;
            }
            return false;
        }
    }

    function withdraw() public onlyOwner{
        payable(_msgSender()).transfer(address(this).balance);
    }
}

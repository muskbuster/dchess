// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ERC1155} from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import {Elo} from "./library/Elo.sol";
import {fiveoutofnineART, Chess} from "./art/fiveOutOfNineArt.sol";
import {IBoard} from "./interfaces/IBoard.sol";

contract Board is IBoard, ERC1155, Ownable{
    uint256 constant TOKEN_PRICE = 0.02 ether; // Token price of minting an NFT for a solved puzzle
    uint256 constant CREATOR_SPLIT = 15; // Percent of token price that goes to creator (e.g. 15 = 15%)
    uint256 constant K_FACTOR = 25e18; //  How quickly elo is adjusted
    uint256 constant RATING_FLOOR = 100e18; // Minimum rating a person or puzzle can have
    uint256 constant DEFAULT_RATING = 1000e18; // Minimum rating a person or puzzle can have
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

    constructor(address initialOwner) Ownable(initialOwner) ERC1155("") {}

    function userHasSolvedPuzzle(uint16 puzzleId, address user) public view returns (bool) {
        return puzzlesById[puzzleId].userHasSolved[user];
    }

    function uri(uint256 _tokenId) public view override returns (string memory) {
        if(_tokenId >= tokenCount){
            revert TokenDoesNotExist(_tokenId);
        }
        uint16 _puzzleId = tokenIdToPuzzleId[_tokenId];
        return fiveoutofnineART.getMetadata(_puzzleId, puzzlesById[_puzzleId].move);
    }


    function mint(uint16 puzzleId) public payable{
        if(msg.value < TOKEN_PRICE){
            revert NotEnoughEtherSent(msg.value, TOKEN_PRICE);
        }
        Puzzle storage puzzle =puzzlesById[puzzleId];
        if(!puzzle.userHasSolved[_msgSender()]){
            revert PuzzleNotSolved(puzzleId);
        }

        uint256 tokenCount_ = tokenCount; // Cache for gas savings
        tokenIdToPuzzleId[tokenCount_] = puzzleId;
        tokenCount = tokenCount_ + 1;
        _mint(_msgSender(),  puzzleId, 1, "");
        emit TokenMinted(puzzleId, _msgSender(), tokenCount_);
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
        puzzle.rating = DEFAULT_RATING;
        puzzle.move = move;
        puzzleCounter = puzzleCounter + 1;

        emit PuzzleAdded(puzzleId, fen, solutionHash, move.board, move.metadata, _msgSender());
    }

    function submitSolution(uint16 puzzleId, bytes memory solution) public returns (bool) {
        if(puzzleId >= puzzleCounter){
            revert InvalidPuzzle(puzzleId);
        }

        Puzzle storage puzzle = puzzlesById[puzzleId];

        if(puzzle.userHasAttempted[_msgSender()]){
            revert AlreadyAttempted(puzzleId);
        }

        
        emit PuzzleAttempted(puzzleId, _msgSender(), solution);

        puzzle.userHasAttempted[_msgSender()] = true;
        puzzle.attemptCount += 1;
        // cache ratings for gas savings
        uint256 userRating  = userRatings[_msgSender()];
        userRating = userRating > 0? userRating : DEFAULT_RATING;
        uint256 puzzleRating = puzzle.rating; 

        if (puzzle.solutionHash == keccak256(solution)) {
            puzzle.userHasSolved[_msgSender()] = true;
            puzzle.solveCount += 1;
            (uint256 ratingAdjustment, ) = Elo.calculateEloUpdate(userRating, puzzleRating, 1e18, K_FACTOR);
            userRatings[_msgSender()] = userRating + ratingAdjustment;
            if(puzzleRating > RATING_FLOOR + ratingAdjustment){
                puzzle.rating = puzzleRating - ratingAdjustment;
                emit PuzzleRatingChanged(puzzleId, puzzleRating - ratingAdjustment); 
            }
            else{
                puzzle.rating = RATING_FLOOR; 
                emit PuzzleRatingChanged(puzzleId, RATING_FLOOR);
            }

            emit PuzzleSolved(puzzleId, _msgSender());
            emit UserRatingChanged(_msgSender(), puzzleRating + ratingAdjustment);
            return true;
        } else {
            (uint256 ratingAdjustment, ) = Elo.calculateEloUpdate(userRating, puzzleRating, 0, K_FACTOR);
            puzzle.rating = puzzleRating + ratingAdjustment;
            if(userRating > RATING_FLOOR + ratingAdjustment){
                userRatings[_msgSender()] = userRating - ratingAdjustment;
                emit UserRatingChanged(_msgSender(), puzzleRating - ratingAdjustment); 
            }
            else{
                userRatings[_msgSender()] = RATING_FLOOR;
                emit UserRatingChanged(_msgSender(), RATING_FLOOR); 
            }

            emit PuzzleRatingChanged(puzzleId, puzzleRating + ratingAdjustment);
            return false;
        }
    }

    function withdraw() public onlyOwner{
        uint256 amount = address(this).balance;
        payable(_msgSender()).transfer(amount);
        emit Withdraw(_msgSender(), amount);
    }
}

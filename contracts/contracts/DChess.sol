// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ERC1155} from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import {MerkleProof} from "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

import {Elo} from "./lib/Elo.sol";
import {threeoutofnineART} from "./lib/threeoutofnineART.sol";

import {IDChess} from "./interfaces/IDChess.sol";

// import "hardhat/console.sol";

contract DChess is IDChess, ERC1155, Ownable {
    using MerkleProof for bytes32[];

    uint256 constant DEFAULT_RATING = 1000;

    uint256 public internalTokenCounter;
    uint256 public tokenMintPrice; // Token price of minting an NFT for a solved puzzle
    uint256 public kFactor;
    uint256 public platformFee; // Percent of token price that goes to the platform (the rest goes to creator)
    bytes32 public merkleRoot; // used for checking if a user is a creator

    struct Puzzle {
        string fen;
        bytes32 solution; // Hash of the solution
        mapping(address => bool) userHasSolved;
        mapping(address => bool) userHasAttempted;
        uint256 rating;
        uint256 metadata; // Used to generate nft art
        address creator;
        string description; // description of the puzzle
    }

    mapping(uint256 => Puzzle) public puzzlesById;
    mapping(address => uint256) public userRatings;

    constructor(address initialOwner) Ownable(initialOwner) ERC1155("") {
        tokenMintPrice = 0.002 ether;
        kFactor = 50;
        platformFee = 40;
        merkleRoot = 0x0000000000000000000000000000000000000000000000000000000000000000;
    }

    function setTokenMintPrice(uint256 _price) public onlyOwner {
        tokenMintPrice = _price;
    }

    function setKFactor(uint256 _kFactor) public onlyOwner {
        kFactor = _kFactor;
    }

    function setPlatformFee(uint256 _fee) public onlyOwner {
        platformFee = _fee;
    }

    function setMerkleRoot(bytes32 _merkleRoot) public onlyOwner {
        merkleRoot = _merkleRoot;
    }

    function userHasSolvedPuzzle(
        uint256 internalTokenId,
        address user
    ) public view returns (bool) {
        return puzzlesById[internalTokenId].userHasSolved[user];
    }

    function userHasAttemptedPuzzle(
        uint256 internalTokenId,
        address user
    ) public view returns (bool) {
        return puzzlesById[internalTokenId].userHasAttempted[user];
    }

    function uri(
        uint256 internalTokenId
    ) public view override returns (string memory) {
        return
            threeoutofnineART.getMetadata(
                internalTokenId,
                puzzlesById[internalTokenId].metadata
            );
    }

    function addPuzzle(
        string calldata fen,
        bytes32 solution,
        uint256 metadata,
        string calldata description,
        bytes32[] calldata proof
    ) public {
        if (!isWhitelisted(_msgSender(), proof)) {
            revert UserNotAuthorized(_msgSender());
        }
        if (bytes(fen).length == 0) {
            revert FENCannotBeEmpty(fen);
        }
        if ((solution).length == 0) {
            revert SolutionCannotBeEmpty(solution);
        }
        if (metadata == 0) {
            revert InvalidMetadata(internalTokenCounter, metadata);
        }

        // Call to ensure that getMetadata is valid
        threeoutofnineART.getMetadata(internalTokenCounter, metadata);

        uint256 internalTokenId = internalTokenCounter;
        Puzzle storage puzzle = puzzlesById[internalTokenId];
        puzzle.fen = fen;
        puzzle.solution = solution;
        puzzle.creator = _msgSender();
        puzzle.rating = DEFAULT_RATING;
        puzzle.description = description;
        puzzle.metadata = metadata;
        internalTokenCounter = internalTokenCounter + 1;

        emit PuzzleAdded(
            internalTokenId,
            fen,
            solution,
            metadata,
            _msgSender(),
            description
        );
    }

    function submitSolution(
        uint256 internalTokenId,
        bytes memory solution
    ) public returns (bool) {
        if (internalTokenId >= internalTokenCounter) {
            revert InvalidPuzzle(internalTokenId);
        }

        Puzzle storage puzzle = puzzlesById[internalTokenId];

        if (puzzle.userHasAttempted[_msgSender()]) {
            revert AlreadyAttempted(internalTokenId);
        }

        puzzle.userHasAttempted[_msgSender()] = true;
        emit PuzzleAttempted(internalTokenId, _msgSender(), solution);

        if (puzzle.solution == keccak256(solution)) {
            puzzle.userHasSolved[_msgSender()] = true;
            adjustRatings(internalTokenId, true);
            emit PuzzleSolved(internalTokenId, _msgSender());
            return true;
        } else {
            adjustRatings(internalTokenId, false);
            return false;
        }
    }

    function mint(uint256 internalTokenId) public payable {
        if (msg.value < tokenMintPrice) {
            revert NotEnoughEtherSent(msg.value, tokenMintPrice);
        }
        Puzzle storage puzzle = puzzlesById[internalTokenId];
        if (!puzzle.userHasSolved[_msgSender()]) {
            revert PuzzleNotSolved(internalTokenId);
        }

        _mint(_msgSender(), internalTokenId, 1, "");
        emit TokenMinted(internalTokenId, _msgSender());
        payable(puzzle.creator).transfer(
            (msg.value * (100 - platformFee)) / 100
        );
    }

    function isWhitelisted(
        address user,
        bytes32[] calldata proof
    ) public view returns (bool) {
        return proof.verify(merkleRoot, keccak256(abi.encodePacked(user)));
    }

    function withdraw() public onlyOwner {
        uint256 amount = address(this).balance;
        payable(_msgSender()).transfer(amount);
        emit Withdraw(_msgSender(), amount);
    }

    function adjustRatings(uint256 internalTokenId, bool success) private {
        Puzzle storage puzzle = puzzlesById[internalTokenId];
        uint256 puzzleRating = puzzle.rating;
        uint256 userRating = userRatings[_msgSender()];
        if (userRating == 0) {
            // initialize to DEFAULT if no rating found
            userRating = DEFAULT_RATING;
            userRatings[_msgSender()] = DEFAULT_RATING;
        }
        (uint256 change, bool negative) = Elo.ratingChange(
            userRating,
            puzzleRating,
            success ? 100 : 0,
            kFactor
        );
        change = change / 100; // change is 2 decimal places (1501 = 15.01 ELO change)

        if (negative) {
            userRatings[_msgSender()] -= change;
            puzzle.rating += change;
        } else {
            userRatings[_msgSender()] += change;
            puzzle.rating -= change;
        }
        emit PuzzleRatingChanged(internalTokenId, puzzle.rating);
        emit UserRatingChanged(_msgSender(), userRatings[_msgSender()]);
    }
}

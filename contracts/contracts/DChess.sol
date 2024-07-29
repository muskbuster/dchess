// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ERC1155} from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "/workspace/dchess/contracts/node_modules/fhevm/lib/TFHE.sol";
import "/workspace/dchess/contracts/node_modules/fhevm/abstracts/EIP712WithModifier.sol";
import {Elo} from "./lib/Elo.sol";

import {IThreeOutOfNineART} from "./interfaces/IThreeOutOfNineART.sol";
import {IDChess} from "./interfaces/IDChess.sol";

// import "hardhat/console.sol";

contract DChess is  IDChess, ERC1155, Ownable,EIP712WithModifier {
    euint32 DEFAULT_RATING = TFHE.asEuint32(100);

    uint256 public internalTokenCounter;
    uint256 public tokenMintPrice; // Token price of minting an NFT for a solved puzzle
    uint256 public kFactor;
    uint256 public platformFee; // Percent of token price that goes to the platform (the rest goes to creator)
    address public artAddr; // location of where art is stored

    struct Puzzle {
        string fen;
        bytes32 solution; // Hash of the solution
        mapping(address => bool) userHasSolved;
        mapping(address => bool) userHasAttempted;
        euint32 rating;
        uint256 metadata; // Used to generate nft art
        address creator;
        string description; // description of the puzzle
    }

    mapping(uint256 => Puzzle) public puzzlesById;
    mapping(address => euint32) public userRatings;

    constructor(
        address initialOwner,
        address _artAddr
    ) Ownable(initialOwner) EIP712WithModifier("Authorization token", "1") ERC1155("") {
        tokenMintPrice = 0.002 ether;
        kFactor = 50;
        platformFee = 40;
        artAddr = _artAddr;
    }

    function setArt(address _artAddr) public onlyOwner {
        artAddr = _artAddr;
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
            IThreeOutOfNineART(artAddr).getMetadata(
                internalTokenId,
                puzzlesById[internalTokenId].metadata
            );
    }

    function addPuzzle(
        string calldata fen,
        bytes32 solution,
        uint256 metadata,
        string calldata description
    ) public {
        if (bytes(fen).length == 0) {
            revert FENCannotBeEmpty(fen);
        }
        if ((solution).length == 0) {
            revert SolutionCannotBeEmpty(solution);
        }
        if (metadata == 0) {
            revert InvalidMetadata(internalTokenCounter, metadata);
        }

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

    function mint(uint256 internalTokenId, uint256 count) public payable {
        if (msg.value != tokenMintPrice * count) {
            revert IncorrectMessageValue(msg.value, tokenMintPrice * count);
        }
        if (count < 1) {
            revert IncorrectMessageValue(0, 0);
        }
        Puzzle storage puzzle = puzzlesById[internalTokenId];
        if (!puzzle.userHasSolved[_msgSender()]) {
            revert PuzzleNotSolved(internalTokenId);
        }

        _mint(_msgSender(), internalTokenId, count, "");
        emit TokenMinted(internalTokenId, _msgSender());
        payable(puzzle.creator).transfer(
            (msg.value * (100 - platformFee)) / 100
        );
    }

    function withdrawAll() public {
        uint256 amount = address(this).balance;
        payable(owner()).transfer(amount);
        emit WithdrawAll(amount);
    }

    function adjustRatings(uint256 internalTokenId, bool success) private {
        Puzzle storage puzzle = puzzlesById[internalTokenId];
        uint256 puzzleRating = TFHE.decrypt(puzzle.rating);
        uint256 userRating = TFHE.decrypt(userRatings[_msgSender()]);
        (uint256 change, bool negative) = Elo.ratingChange(
            userRating,
            puzzleRating,
            success ? 100 : 0,
            kFactor
        );
        change = change / 100; // change is 2 decimal places (1501 = 15.01 ELO change)

        if (negative) {
            userRating -= change;
            puzzleRating += change;
        } else {
            userRating+= change;
            puzzleRating-= change;
        }
        userRatings[_msgSender()]= TFHE.asEuint32(userRating);
        puzzle.rating=TFHE.asEuint32(puzzleRating);
        emit PuzzleRatingChanged(internalTokenId, puzzle.rating);
        emit UserRatingChanged(_msgSender(), userRatings[_msgSender()]);
    }
}

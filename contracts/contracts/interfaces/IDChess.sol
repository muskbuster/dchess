// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {IERC1155} from "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

interface IDChess {
    event PuzzleAdded(
        uint256 internalTokenId,
        string fen,
        bytes32 solutionHash,
        uint256 board,
        address creator,
        string description
    );
    event PuzzleSolved(uint256 internalTokenId, address user);
    event PuzzleAttempted(
        uint256 internalTokenId,
        address user,
        bytes solutionSubmission
    );
    event UserRatingChanged(address user, uint256 newUserRating);
    event PuzzleRatingChanged(uint256 internalTokenId, uint256 newPuzzleRating);
    event TokenMinted(uint256 internalTokenId, address solver);
    event WithdrawAll(uint256 amount);

    error FENCannotBeEmpty(string s);
    error SolutionCannotBeEmpty(bytes32 b);
    error InvalidPuzzle(uint256 internalTokenId);
    error AlreadyAttempted(uint256 internalTokenId);
    error PuzzleNotSolved(uint256 internalTokenId);
    error TokenDoesNotExist(uint256 tokenId);
    error IncorrectMessageValue(uint256 amountSent, uint256 requiredAmount);
    error InvalidMetadata(uint256 internalTokenId, uint256 metadata);
    error UserNotAuthorized(address user);

    function userHasSolvedPuzzle(
        uint256 internalTokenId,
        address user
    ) external view returns (bool);

    function mint(uint256 internalTokenId, uint256 count) external payable;

    function addPuzzle(
        string calldata fen,
        bytes32 solutionHash,
        uint256 position,
        string calldata description,
        bytes32[] calldata proof
    ) external;

    function submitSolution(
        uint256 internalTokenId,
        bytes memory solution
    ) external returns (bool);

    function withdrawAll() external;

    function isWhitelisted(
        address user,
        bytes32[] calldata proof
    ) external view returns (bool);
}

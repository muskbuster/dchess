// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;


import {IERC1155} from "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Chess} from "../art/Chess.sol";

interface IBoard {
    event PuzzleAdded(uint16 puzzleId, string fen, bytes32 solutionHash, uint256 baord, uint256 metadata, address creator); 
    event PuzzleSolved(uint16 puzzleId, address user);
    event PuzzleAttempted(uint16 puzzleId, address user, bytes solutionSubmission);
    event UserRatingChanged(address user, uint256 newUserRating);
    event PuzzleRatingChanged(uint16 puzzleId, uint256 newPuzzleRating);
    event TokenMinted(uint16 puzzleId, address solver, uint256 tokenId); 
    event Withdraw(address owner, uint256 amount);

    function userHasSolvedPuzzle(uint16 puzzleId, address user) external view returns (bool);
    function mint(uint16 puzzleId) external payable;
    function addPuzzle(string memory fen, bytes32 solutionHash, Chess.Move memory move) external;
    function submitSolution(uint16 puzzleId, bytes memory solution) external returns (bool);
    function withdraw() external;
}

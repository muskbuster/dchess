// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract Board is ERC1155, Ownable {
    using ECDSA for bytes32;
    using Strings for uint256;

    enum PuzzleStatus {
        Locked,
        Unlocked,
        Solved,
        Expired
    }

    struct Puzzle {
        string fen;
        bytes solution; // hash of the solution
        uint256 price;
        uint256 solveCount; // amount of puzzles solved
        uint256 expiredCount; // amount of puzzle expired
        uint256 unlockCount; // amount of attempts made
        uint256 staked; // cumulative amount staked
        address[] solvers;
        uint256 activeAttemptCount; // active attempts (unlocked)
        address[] activeAttempts; // users that are actively attempting; used for redistribution when expired
        mapping(address => uint256) claim; // amount a receiver has claim over
        mapping(address => PuzzleStatus) status;
        mapping(address => uint256) unlockTimestamp; // time when puzzle was unlocked
    }

    uint256 private INITIAL_VALUE = 0.001 ether; // 0.001 ETH
    uint256 private FACTOR = 125; // 1.25 creates problems with floating numbers
    uint256 private expireLength = 1 hours; // 1 hour

    uint16 public puzzleCounter;
    mapping(uint16 => Puzzle) public puzzlesById;
    mapping(address => uint256) public accountBalance; // separate from NFT balance

    error NotAuthorized();
    error AlreadyUnlocked(uint16 puzzleId);
    error PuzzleLocked(uint16 puzzleId);
    error PuzzleExpired(uint16 puzzleId);
    error PuzzleSolved(uint16 puzzleId);

    constructor(address initialOwner) ERC1155("") Ownable(initialOwner) {}

    function getSolvers(uint16 puzzleId) public view returns (address[] memory) {
        return puzzlesById[puzzleId].solvers;
    }

    function getStatus(uint16 puzzleId, address user) public view returns (PuzzleStatus) {
        return puzzlesById[puzzleId].status[user];
    }

    function uri(uint256 _tokenId) public pure override returns (string memory) {
        bytes memory dataURI = abi.encodePacked(
            "{",
            '"name": "Puzzle #',
            (_tokenId + 1).toString(),
            '",',
            '"description": "Chess puzzles on chain",',
            '"image": "',
            generateImage(_tokenId),
            '"',
            "}"
        );
        return string(abi.encodePacked("data:application/json;base64,", Base64.encode(dataURI)));
    }

    function generateImage(uint256 _tokenId) public pure returns (string memory) {
        bytes memory svg = abi.encodePacked(
            '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 350 350">',
            "<style>.base { fill: white; font-family: serif; font-size: 14px; }</style>",
            '<rect width="100%" height="100%" fill="blue" />',
            '<text x="50%" y="40%" class="base" dominant-baseline="middle" text-anchor="middle">',
            "Grandmaster",
            "</text>",
            '<text x="50%" y="50%" class="base" dominant-baseline="middle" text-anchor="middle">',
            "Puzzle: #",
            (_tokenId + 1).toString(),
            "</text>",
            "</svg>"
        );
        return string(abi.encodePacked("data:image/svg+xml;base64,", Base64.encode(svg)));
    }

    function addPuzzle(string memory fen, bytes memory solution) public onlyOwner {
        uint16 puzzleId = puzzleCounter;

        Puzzle storage puzzle = puzzlesById[puzzleId];
        puzzle.fen = fen;
        puzzle.solution = solution;
        puzzle.price = INITIAL_VALUE;
        puzzle.solveCount = 0;
        puzzle.expiredCount = 0;
        puzzle.unlockCount = 0;

        puzzleCounter += 1;
    }

    function unlockPuzzle(uint16 puzzleId) public payable {
        require(puzzleId < puzzleCounter);

        Puzzle storage puzzle = puzzlesById[puzzleId];
        require(msg.value >= puzzle.price);
        if (puzzle.status[_msgSender()] == PuzzleStatus.Locked || puzzle.status[_msgSender()] == PuzzleStatus.Expired) {
            puzzle.unlockTimestamp[_msgSender()] = block.timestamp;
            puzzle.status[_msgSender()] = PuzzleStatus.Unlocked;
            puzzle.staked += puzzle.price;
            puzzle.claim[_msgSender()] += puzzle.price;
            puzzle.activeAttemptCount += 1;
            puzzle.activeAttempts.push(_msgSender());
            puzzle.unlockCount += 1;
        } else {
            revert AlreadyUnlocked(puzzleId);
        }
    }

    function solvePuzzle(uint16 puzzleId, bytes memory solution, bytes memory sig) public returns (bool) {
        require(puzzleId < puzzleCounter);
        Puzzle storage puzzle = puzzlesById[puzzleId];

        if (puzzle.status[_msgSender()] == PuzzleStatus.Locked) {
            revert PuzzleLocked(puzzleId);
        }

        if (
            puzzle.status[_msgSender()] == PuzzleStatus.Expired
                || (block.timestamp > (puzzle.unlockTimestamp[_msgSender()] + expireLength))
        ) {
            revert PuzzleExpired(puzzleId);
        }

        if (puzzle.status[_msgSender()] == PuzzleStatus.Solved) {
            revert PuzzleSolved(puzzleId);
        }

        address signerAddress = recoverAddress(keccak256(abi.encodePacked(solution)), sig);

        if (signerAddress != owner()) {
            revert NotAuthorized();
        }

        if (keccak256(puzzle.solution) == keccak256(solution)) {
            _mint(_msgSender(), puzzleId, 1, "");
            puzzle.status[_msgSender()] = PuzzleStatus.Solved;
            puzzle.solvers.push(_msgSender());
            puzzle.solveCount += 1;
            accountBalance[_msgSender()] += puzzle.claim[_msgSender()];
            adjustPrice(puzzleId, true);
            return true;
        } else {
            puzzle.expiredCount += 1;
            puzzle.status[_msgSender()] = PuzzleStatus.Expired;
            disperseFunds(puzzleId, _msgSender());
            adjustPrice(puzzleId, false);
            return false;
        }
    }

    function checkExpiredAll() public {
        for (uint16 i = 0; i < puzzleCounter; i++) {
            checkExpired(i);
        }
    }

    function checkExpired(uint16 puzzleId) public {
        Puzzle storage puzzle = puzzlesById[puzzleId];

        // for each puzzle: go over all active attempts
        address[] memory activeAttempts = puzzle.activeAttempts;
        delete puzzle.activeAttempts; // refresh active attempts

        uint256 newActiveAttemptCount = 0;
        for (uint256 i = 0; i < puzzle.activeAttemptCount; i++) {
            address user = activeAttempts[i];
            if (puzzle.status[user] == PuzzleStatus.Unlocked) {
                if (block.timestamp > (puzzle.unlockTimestamp[user] + expireLength)) {
                    puzzle.status[user] = PuzzleStatus.Expired;
                    puzzle.expiredCount += 1;
                    disperseFunds(puzzleId, user);
                    adjustPrice(puzzleId, false);
                } else {
                    newActiveAttemptCount += 1;
                    puzzle.activeAttempts.push(user);
                }
            }
        }
        puzzle.activeAttemptCount = newActiveAttemptCount;
    }

    function withdraw() public {
        address payable receiver = payable(_msgSender());
        uint256 userBalance = accountBalance[_msgSender()];
        accountBalance[_msgSender()] = 0;
        receiver.transfer(userBalance);
    }

    /* INTERNAL FUNCTIONS */

    function disperseFunds(uint16 puzzleId, address user) internal {
        Puzzle storage puzzle = puzzlesById[puzzleId];

        if (puzzle.solveCount == 0) {
            return;
        }

        uint256 amount = puzzle.claim[user] / puzzle.solveCount;
        for (uint256 i = 0; i < puzzle.solveCount; i++) {
            accountBalance[puzzle.solvers[i]] += amount;
        }
        puzzle.claim[user] = 0;
    }

    function adjustPrice(uint16 puzzleId, bool increase) internal {
        Puzzle storage puzzle = puzzlesById[puzzleId];

        if (increase) {
            puzzle.price = (puzzle.price * FACTOR) / 100;
        } else {
            puzzle.price = (puzzle.price / FACTOR) * 100;
        }
    }

    function recoverAddress(bytes32 hash, bytes memory signature) internal pure returns (address) {
        bytes32 hashed = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", hash));
        return hashed.recover(signature);
    }
}

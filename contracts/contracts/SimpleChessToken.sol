// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;
import {PRBMathUD60x18} from "prb-math/contracts/PRBMathUD60x18.sol";

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import {threeoutofnineART} from "./lib/threeoutofnineART.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Elo} from "./lib/Elo.sol";

contract SimpleChessToken is ERC721, Ownable {
    using Strings for uint256;

    mapping(uint256 => uint256) public positions; // token ID maps to puzzle
    mapping(uint256 => uint256) public puzzleRatings;
    mapping(address => uint256) public userRatings;

    uint256 totalSupply;
    uint256 kFactor = 50;

    constructor(
        string memory name,
        string memory symbol
    ) ERC721(name, symbol) Ownable(msg.sender) {}

    function mint(uint256 position, address to) external {
        positions[totalSupply] = position;
        _safeMint(to, totalSupply++);
    }

    function tokenURI(
        uint256 _tokenId
    ) public view override returns (string memory) {
        require(_tokenId <= totalSupply, "Token not found");
        return threeoutofnineART.getMetadata(_tokenId, positions[_tokenId]);
    }

    function setUserRating(address user, uint256 rating) external onlyOwner {
        userRatings[user] = rating;
    }

    function setPuzzleRating(
        uint256 puzzleId,
        uint256 rating
    ) external onlyOwner {
        puzzleRatings[puzzleId] = rating;
    }

    function updateUserRating(
        address user,
        uint256 puzzleId,
        uint256 scoreA
    ) public {
        // Cache for gas savings
        uint256 userRating = userRatings[user];
        uint256 puzzleRating = puzzleRatings[puzzleId];

        uint256 ratingDiff;
        bool comparison = userRating >= puzzleRating;
        if (comparison) {
            ratingDiff = userRating - puzzleRating;
        } else {
            ratingDiff = puzzleRating - userRating;
        }

        uint256 exp = comparison
            ? PRBMathUD60x18.div(
                1e18,
                PRBMathUD60x18.pow(10e18, ratingDiff / 400)
            )
            : PRBMathUD60x18.pow(10e18, ratingDiff / 400);

        uint256 Ea = PRBMathUD60x18.div(1e18, 1e18 + exp); //expected value of A at current rating
        if (scoreA > Ea) {
            ratingDiff = PRBMathUD60x18.mul(25e18, scoreA - Ea);
            userRatings[user] = userRating + ratingDiff;
            if (puzzleRating > 100e18 + ratingDiff) {
                puzzleRatings[puzzleId] = puzzleRating - ratingDiff;
            } else {
                puzzleRatings[puzzleId] = 100e18; // Ratings flooor
            }
        } else {
            ratingDiff = PRBMathUD60x18.mul(25e18, Ea - scoreA);
            puzzleRatings[puzzleId] = puzzleRating + ratingDiff;
            if (userRating > 100e18 + ratingDiff) {
                userRatings[user] = userRating - ratingDiff;
            } else {
                userRatings[user] = 100e18;
            }
        }
    }

    function updateElo(address player, uint256 tokenId, bool solved) public {
        uint256 score = 0;
        if (solved) {
            score = 100; // player 1 won
        }

        (uint256 change, bool negative) = Elo.ratingChange(
            userRatings[player],
            puzzleRatings[tokenId],
            score,
            kFactor
        );
        change = change / 100; // be aware that change is 2 decimal places (1501 = 15.01 ELO change)

        if (negative) {
            userRatings[player] -= change;
            puzzleRatings[tokenId] += change;
        } else {
            userRatings[player] += change;
            puzzleRatings[tokenId] -= change;
        }
    }
}

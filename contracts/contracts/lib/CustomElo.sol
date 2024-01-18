// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;
import {PRBMathUD60x18} from "prb-math/contracts/PRBMathUD60x18.sol";

/**
 * @title Elo
 * @dev Library for calculating Elo ratings. Can be used for any zero-sum.
 * @dev uses 400 as the rating spread (i.e. every 400 difference in rating between is a factor of 10 difference in  win probability)
 * @dev All numbers are represented as fixed point numbers with 18 decimals (i.e. D.60.18)
 */

library Elo {

    /**
     * @dev Calculates how much scores of player A needs to be updated after a batch with player B
     * @dev All input and output numbers are represented as fixed point numbers with 18 decimals (i.e. D60.18)
     * @dev To get how much B's score needs to be update, take negative of the returned value
     * @dev returns the amount that A's elo changes, and a boolean that signifies if it's a negative or positive change
     */
    function calculateEloUpdate(uint256 ratingA, uint256 ratingB, uint256 scoreA, uint256 k)internal pure returns (uint256 , bool){
        uint256 ratingDiff;
        bool comparison = ratingA>= ratingB; 
        if(comparison){
            ratingDiff = ratingA - ratingB;
        }
        else{
            ratingDiff =  ratingB - ratingA;
        }

        uint256 exp = comparison ? 
            PRBMathUD60x18.div(1e18 , PRBMathUD60x18.pow(10e18, ratingDiff /400)):
            PRBMathUD60x18.pow(10e18, ratingDiff /400); 

        uint256 Ea = PRBMathUD60x18.div(1e18, 1e18 + exp);  // expected value of A at current rating
        if(scoreA > Ea){
            ratingDiff = PRBMathUD60x18.mul( k, scoreA - Ea);
            return (ratingDiff, true);
        }
        else{
            ratingDiff = PRBMathUD60x18.mul( k, Ea - scoreA );
            return (ratingDiff, false);
        }

    }

}
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {IERC1155} from "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

interface IThreeOutOfNineART {
    function getMetadata(
        uint256 _internalId,
        uint256 _board
    ) external view returns (string memory);
}

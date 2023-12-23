pragma solidity ^0.8.9;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import {Chess} from "./art/fiveOutOfNineArt.sol";
import {fiveoutofnineART} from "./art/fiveOutOfNineArt.sol";

contract NFT is ERC721 {
    using Strings for  uint256;
    string private baseURI;
    mapping(uint256 => uint256) public tokenInternalIds;


    constructor(string memory name, string memory symbol) ERC721(name, symbol) {
        baseURI = "";
        _safeMint(msg.sender, 0);
    }

    function tokenURI(uint256 _tokenId) public view virtual override returns (string memory) {
        return bytes(baseURI).length == 0
            ? tokenURI(_tokenId,Chess.Move(
            0x3256230011111100000000000000000099999900BCDECB000000001,
            0x851C4A2
        ) )
            : string(abi.encodePacked(baseURI, _tokenId.toString()));
    }

    function tokenURI(uint256 _tokenId, Chess.Move memory board) public view returns (string memory) {
        return fiveoutofnineART.getMetadata(_tokenId, board);
    }

}

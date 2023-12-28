import { ethers } from "hardhat"

import { NFT } from "../typechain-types"
import { FENToBoard } from "../utils/fiveOutOfNineArt"
import { AbiCoder, StructFragment } from "ethers"
import { parseAndSaveTokenUri, tokenURIToHtml } from "../utils/encoding"

let NFTContract: NFT

describe("Test art", () => {
	beforeEach(async () => {
		NFTContract = await ethers.deployContract("NFT", ["adfsa", "adfas"])
	})

	it("prints nft ", async () => {
		// console.log("nft uri", await NFTContract["tokenURI(uint256)"](1))
	})

	it("converts from algebraic notation to board nft art", async () => {
		// const boardState = "8/1rbqkbr1/1pppppp1/8/8/1KPPPPP1/1RNQKNR1/8"
		const boardState = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR"
		const board = FENToBoard(boardState, true) //BigInt(
		// 	"0x3256230011111100000000000000000099999900BCDECB000000001"
		// ) //FENToBoard(boardState, true)

		const metadata = BigInt("0x851c4a2")
		const move = { board, metadata }

		await NFTContract.mint(move, await ethers.provider.getSigner())
		const uri = await NFTContract.tokenURI(0)
		parseAndSaveTokenUri(uri, "out.html")
	})
})

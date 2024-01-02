import { ethers } from "hardhat"

import { NFT } from "../typechain-types"
import { FENToBoard } from "../utils/fiveOutOfNineArt"
import { parseAndSaveTokenUri } from "../utils/encoding"

let NFTContract: NFT

describe("Test art", () => {
	beforeEach(async () => {
		NFTContract = await ethers.deployContract("NFT", ["adfsa", "adfas"])
	})

	it("converts from FEN puzzle and solution to board nft art", async () => {
		const sampleProblem1 =
			"r2qkb1r/pp2nppp/3p4/2pNN1B1/2BnP3/3P4/PPP2PPP/R2bK2R w KQkq - 1 1"

		const move = FENToBoard(sampleProblem1)
		await NFTContract.mint(move, await ethers.provider.getSigner())
		const uri1 = await NFTContract.tokenURI(0)
		parseAndSaveTokenUri(uri1, "out-1.html")
	})

	it("FEN puzzle and solution to board nft art II ", async () => {
		const sampleProblem2 = "1rb4r/pkPp3p/1b1P3n/1Q6/N3Pp2/8/P1P3PP/7K w - - 1 1"
		const move = FENToBoard(sampleProblem2)
		await NFTContract.mint(move, await ethers.provider.getSigner())
		const uri1 = await NFTContract.tokenURI(0)
		parseAndSaveTokenUri(uri1, "out-2.html")
	})
})

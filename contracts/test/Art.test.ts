import { ethers } from "hardhat"
import { NFT } from "../typechain-types"

let NFTContract: NFT

describe("Test art", () => {
	beforeEach(async () => {
		NFTContract = await ethers.deployContract("NFT", ["adfsa", "adfas"])
	})

	it("prints nft ", async () => {
		console.log("nft uri", await NFTContract["tokenURI(uint256)"](1))
	})
})

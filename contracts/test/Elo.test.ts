import { ethers } from "hardhat"
import { NFT } from "../typechain-types"
import { expect } from "chai"
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers"

let NFTContract: NFT
let deployer: HardhatEthersSigner
let user1: HardhatEthersSigner

describe("test elo system updates correctly", () => {
	beforeEach(async () => {
		NFTContract = await ethers.deployContract("NFT", ["adfsa", "adfas"])
		;[deployer, user1] = await ethers.getSigners()
	})

	it("updates elo correctly for solved puzzle", async () => {
		// Set user rating to 1000
		await NFTContract.setUserRating(user1, ethers.parseEther("1477"))
		await NFTContract.setPuzzleRating(1, ethers.parseEther("1609"))
		await NFTContract.updateUserRating(user1, 1, ethers.parseEther("1"))
		expect(await NFTContract.userRatings(user1)).to.be.closeTo(
			ethers.parseEther("1494"),
			ethers.parseEther("1")
		)
	})
	it("updates elo correctly for failed puzzle", async () => {
		// Set user rating to 1000
		await NFTContract.setUserRating(user1, ethers.parseEther("1477"))
		await NFTContract.setPuzzleRating(1, ethers.parseEther("1609"))
		await NFTContract.updateUserRating(user1, 1, 0)
		expect(await NFTContract.userRatings(user1)).to.be.closeTo(
			ethers.parseEther("1469"),
			ethers.parseEther("1")
		)
	})
})

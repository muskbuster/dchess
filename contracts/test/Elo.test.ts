import { ethers } from "hardhat"
import { SimpleChessToken } from "../typechain-types"
import { expect } from "chai"
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers"

let simpleChessToken: SimpleChessToken
let deployer: HardhatEthersSigner
let user1: HardhatEthersSigner

describe("Validate ELO ratings", () => {
	beforeEach(async () => {
		simpleChessToken = await ethers.deployContract("SimpleChessToken", [
			"Test",
			"TEST",
		])
		;[deployer, user1] = await ethers.getSigners()
	})

	it("updates elo correctly for solved puzzle", async () => {
		await simpleChessToken.setUserRating(user1, 1477)
		await simpleChessToken.setPuzzleRating(0, 1609)
		await simpleChessToken.updateElo(user1, 0, true)
		expect(await simpleChessToken.userRatings(user1)).to.be.greaterThan(1477)
		expect(await simpleChessToken.puzzleRatings(0)).to.be.lessThan(1609)
	})

	it("updates elo correctly for failed puzzle", async () => {
		await simpleChessToken.setUserRating(user1, 1477)
		await simpleChessToken.setPuzzleRating(0, 1609)
		await simpleChessToken.updateElo(user1, 0, false)
		expect(await simpleChessToken.userRatings(user1)).to.be.lessThan(1477)
		expect(await simpleChessToken.puzzleRatings(0)).to.be.greaterThan(1609)
	})
})

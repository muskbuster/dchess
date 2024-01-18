import { expect } from "chai"
import { deployments, ethers } from "hardhat"

import { Board } from "../typechain-types"
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers"
import { FENToBoard } from "../utils/parser"
import { parseEther } from "ethers"
import { parseAndSaveTokenUri } from "../utils/encoding"
import { hashed } from "../utils/encoding"

const _INTERFACE_ID_IERC1155 = "0xd9b67a26"
const DEFAULT_RATING = parseEther("1000")

describe("Board", function () {
	let instance: Board
	let owner: HardhatEthersSigner
	let player: HardhatEthersSigner
	let puzzleCreator: HardhatEthersSigner
	let rest: Array<HardhatEthersSigner>

	const setup = deployments.createFixture(async ({ deployments, ethers }) => {
		await deployments.fixture(["Board"])
		const boardDeployment = await deployments.get("Board")
		instance = (await ethers.getContractAt(
			"Board",
			boardDeployment.address
		)) as Board
	})

	const sampleProblem1 =
		"r2qkb1r/pp2nppp/3p4/2pNN1B1/2BnP3/3P4/PPP2PPP/R2bK2R w KQkq - 1 1"
	const sampleSolution1 = "Nf6+"
	const solution1 = hashed(sampleSolution1)
	const solution1Bytes = ethers.toUtf8Bytes(sampleSolution1)
	const move1 = FENToBoard(sampleProblem1)

	const sampleProblem2 = "1rb4r/pkPp3p/1b1P3n/1Q6/N3Pp2/8/P1P3PP/7K w - - 1 1"
	const sampleSolution2 = "Qd5+"
	const solution2 = hashed(sampleSolution2)
	const solution2Bytes = ethers.toUtf8Bytes(sampleSolution2)
	const move2 = FENToBoard(sampleProblem2)

	async function generateSignature(hash: string) {
		const messageHash = ethers.keccak256(hash)
		const solutionHashBytes = ethers.getBytes(messageHash)
		return await owner.signMessage(solutionHashBytes)
	}

	beforeEach(async function () {
		await setup()
		;[owner, player, puzzleCreator, ...rest] = await ethers.getSigners()
	})

	describe("Deployment", function () {
		it("Should support ERC1155", async function () {
			expect(await instance.supportsInterface(_INTERFACE_ID_IERC1155)).to.be
				.true
		})

		it("Should set the right owner", async function () {
			expect(await instance.owner()).to.equal(owner.address)
		})
	})

	describe("Add an unencrypted problem", function () {
		it("Be able to see it but not solve it", async function () {
			await expect(
				instance
					.connect(puzzleCreator)
					.addPuzzle(sampleProblem1, solution1, move1)
			)
				.to.emit(instance, "PuzzleAdded")
				.withArgs(
					0,
					sampleProblem1,
					solution1,
					move1.board,
					move1.metadata,
					puzzleCreator.address
				)

			expect(await instance.puzzleCounter()).to.equal(1)
			const puzzle = await instance.puzzlesById(0)
			expect(puzzle.fen).to.equal(sampleProblem1)
			expect(puzzle.solutionHash).to.equal(solution1)
			expect(puzzle.solveCount).to.equal(0)
			expect(puzzle.attemptCount).to.equal(0)
			expect(puzzle.rating).to.equal(DEFAULT_RATING)
			expect(puzzle.creator).to.equal(puzzleCreator.address)
		})
	})

	describe("Attempt to solve a puzzle", function () {
		beforeEach(async () => {
			await instance
				.connect(puzzleCreator)
				.addPuzzle(sampleProblem1, solution1, move1)

			await instance.addPuzzle(sampleProblem2, solution2, move2)
		})

		describe("for an incorrectly solved problem", () => {
			beforeEach(async () => {
				await expect(
					instance.connect(player).submitSolution(0, ethers.toUtf8Bytes("abcd"))
				)
					.to.emit(instance, "PuzzleAttempted")
					.withArgs(0, player.address, ethers.toUtf8Bytes("abcd"))
					.to.emit(instance, "UserRatingChanged")
					.withArgs(player.address, parseEther("987.5"))
					.to.emit(instance, "PuzzleRatingChanged")
					.withArgs(0, parseEther("1012.5"))
			})

			it("Puzzle elo updates correctly", async function () {
				const puzzleAfterNotSolving = await instance.puzzlesById(0)
				expect(puzzleAfterNotSolving.attemptCount).to.equal(1)
				expect(puzzleAfterNotSolving.solveCount).to.equal(0)
				expect(puzzleAfterNotSolving.rating).to.equal(parseEther("1012.5"))
				expect(await instance.userHasSolvedPuzzle(0, player)).to.equal(false)
				expect(await instance.userRatings(player.address)).to.equal(
					parseEther("987.5")
				)
			})

			it("doesn't allow users to correctly mint for an incorrectly solved problem", async function () {
				await expect(
					instance.connect(player).mint(0, { value: ethers.parseEther(".02") })
				)
					.to.be.revertedWithCustomError(instance, "PuzzleNotSolved")
					.withArgs(0)
				await expect(instance.connect(player).mint(0))
					.to.be.revertedWithCustomError(instance, "NotEnoughEtherSent")
					.withArgs(0, ethers.parseEther(".02"))
			})
		})

		describe("For a correctly solved problem", async () => {
			beforeEach(async () => {
				expect(await instance.userRatings(owner.address)).to.equal(0)

				await expect(instance.connect(player).submitSolution(0, solution1Bytes))
					.to.emit(instance, "PuzzleAttempted")
					.withArgs(0, player.address, solution1Bytes)
					.to.emit(instance, "UserRatingChanged")
					.withArgs(player.address, parseEther("1012.5"))
					.to.emit(instance, "PuzzleRatingChanged")
					.withArgs(0, parseEther("987.5"))
					.to.emit(instance, "PuzzleSolved")
					.withArgs(0, player.address)
			})

			it("A user's and the puzzle's ratings should be correctly updated", async function () {
				const solvedPuzzle = await instance.puzzlesById(0)
				expect(solvedPuzzle.attemptCount).to.equal(1)
				expect(solvedPuzzle.solveCount).to.equal(1)
				expect(solvedPuzzle.rating).to.equal(parseEther("987.5"))
				expect(await instance.userHasSolvedPuzzle(0, player)).to.equal(true)
				expect(await instance.userRatings(player.address)).to.equal(
					parseEther("1012.5")
				)
				await instance.connect(player).submitSolution(1, solution2Bytes)
				const puzzle2 = await instance.puzzlesById(1)
				expect(puzzle2.attemptCount).to.equal(1)
				expect(puzzle2.solveCount).to.equal(1)
				expect(puzzle2.rating).to.be.closeTo(
					parseEther("987.949529709319"),
					10000000n
				)
				expect(await instance.userHasSolvedPuzzle(1, player)).to.equal(true)
				expect(await instance.userRatings(player.address)).to.be.closeTo(
					parseEther("1024.55047029068"),
					10000000n
				)
			})
			it("Reverts for attempts solve problem that was previously attempted", async function () {
				await expect(instance.connect(player).submitSolution(0, solution1Bytes))
					.to.be.revertedWithCustomError(instance, "AlreadyAttempted")
					.withArgs(0)
			})

			it("only solvers of the puzzle can mint a token", async () => {
				await expect(
					instance.connect(owner).mint(0, { value: ethers.parseEther(".02") })
				)
					.to.be.revertedWithCustomError(instance, "PuzzleNotSolved")
					.withArgs(0)
			})

			describe("after someone has minted", async () => {
				let beforeCreatorBalance: bigint
				let beforeOwnerBalance: bigint

				beforeEach(async () => {
					beforeCreatorBalance = await ethers.provider.getBalance(puzzleCreator)
					beforeOwnerBalance = await ethers.provider.getBalance(owner)
					await expect(
						instance
							.connect(player)
							.mint(0, { value: ethers.parseEther(".02") })
					)
						.to.emit(instance, "TokenMinted")
						.withArgs(0, player.address, 0)
				})

				it("Properly disperses funds when a user mints a token", async function () {
					expect(await instance.balanceOf(player.address, 0)).to.equal(1)
					await parseAndSaveTokenUri(await instance.uri(0), "board.test.html") // Can validate html
					expect(await ethers.provider.getBalance(instance)).to.equal(
						ethers.parseEther(".017")
					)
					expect(await ethers.provider.getBalance(puzzleCreator)).to.equal(
						ethers.parseEther(".003") + beforeCreatorBalance
					)
				})

				it("only owner can withdraw funds", async function () {
					await expect(instance.connect(player).withdraw())
						.to.be.revertedWithCustomError(
							instance,
							"OwnableUnauthorizedAccount"
						)
						.withArgs(await player.getAddress())
					await expect(instance.connect(owner).withdraw())
						.to.emit(instance, "Withdraw")
						.withArgs(owner.address, ethers.parseEther(".017"))
					expect(await ethers.provider.getBalance(owner)).to.be.closeTo(
						ethers.parseEther(".017") + beforeOwnerBalance,
						parseEther("0.001")
					)
					expect(await ethers.provider.getBalance(instance)).to.equal(0)
				})
			})
		})

		describe("Statistics", async function () {
			const players = 5
			let solves1 = 0
			let solves2 = 0
			const scoreCount = new Map()

			const solution1 = hashed(sampleSolution1)
			const solution2 = hashed(sampleSolution2)

			async function simulateSolving() {
				for (let i = 0; i < players; i++) {
					const signer = rest[i]
					const skip1 = Math.random() < 0.5
					if (!skip1) {
						await instance.connect(signer).submitSolution(0, solution1Bytes)
						solves1++
						scoreCount.set(signer.address, 1)
					} else {
						await instance
							.connect(signer)
							.submitSolution(0, ethers.toUtf8Bytes("abcd"))
						scoreCount.set(signer.address, 0)
					}

					const skip2 = Math.random() < 0.5
					if (!skip2) {
						await instance.connect(signer).submitSolution(1, solution2Bytes)
						solves2++
						if (scoreCount.has(signer.address)) {
							scoreCount.set(signer.address, scoreCount.get(signer.address) + 1)
						} else {
							scoreCount.set(signer.address, 1)
						}
					} else {
						await instance
							.connect(signer)
							.submitSolution(1, ethers.toUtf8Bytes("abcd"))
					}
					scoreCount.set(
						signer.address,

						{
							score: scoreCount.get(signer.address),
							elo: Number(await instance.userRatings(signer.address)),
						}
					)
				}
			}

			beforeEach(async function () {
				await instance
					.connect(puzzleCreator)
					.addPuzzle(sampleProblem1, solution1, move1)
				await instance
					.connect(puzzleCreator)
					.addPuzzle(sampleProblem2, solution2, move2)
				await simulateSolving()
			})

			it("Able to construct points leaderboard", async function () {
				const puzzle1 = await instance.puzzlesById(0)
				const puzzle2 = await instance.puzzlesById(1)

				// Ensure score sorting is equal to puzzle sorting
				const arraysSortedFromScore = Array.from(scoreCount.keys()).sort(
					(a, b) => {
						const scoreDiff = scoreCount.get(a).score - scoreCount.get(b).score
						if (scoreDiff > 0) {
							return scoreDiff
						} else {
							return scoreCount.get(a).elo - scoreCount.get(b).elo
						}
					}
				)
				const arraysSortedFromElo = Array.from(scoreCount.keys()).sort(
					(a, b) => {
						return scoreCount.get(a).elo - scoreCount.get(b).elo
					}
				)
				expect(arraysSortedFromScore).to.deep.equal(arraysSortedFromElo)
				expect(puzzle1.solveCount).to.be.equal(solves1)
				expect(puzzle2.solveCount).to.be.equal(solves2)

				expect(puzzle1.attemptCount).to.be.equal(players)
				expect(puzzle2.attemptCount).to.be.equal(players)
			})
		})
	})
})

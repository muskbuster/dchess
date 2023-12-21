import { expect } from "chai"
import { deployments, ethers } from "hardhat"
import { time } from "@nomicfoundation/hardhat-network-helpers"

import { Board } from "../typechain-types"
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers"

const _INTERFACE_ID_IERC1155 = "0xd9b67a26"

describe("Board", function () {
	let instance: Board
	let owner: HardhatEthersSigner
	let addr1: HardhatEthersSigner
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
		"r2qkb1r/pp2nppp/3p4/2pNN1B1/2BnP3/3P4/PPP2PPP/R2bK2R w KQkq - 1 0"
	const sampleSolution1 = "Nf6+"
	const sampleProblem2 = "1rb4r/pkPp3p/1b1P3n/1Q6/N3Pp2/8/P1P3PP/7K w - - 1 0"
	const sampleSolution2 = "Qd5+"

	function hashed(str: string) {
		// first convert to bytes
		const _bytes = ethers.toUtf8Bytes(str)
		// then hash it
		return ethers.keccak256(_bytes)
	}

	async function generateSignature(hash: string) {
		const messageHash = ethers.keccak256(hash)
		const solutionHashBytes = ethers.getBytes(messageHash)
		return await owner.signMessage(solutionHashBytes)
	}

	beforeEach(async function () {
		;[owner, addr1, ...rest] = await ethers.getSigners()
		await setup()
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
			const solution1 = hashed(sampleSolution1)
			const solution2 = hashed(sampleSolution2)

			await instance.addPuzzle(sampleProblem1, solution1)
			await expect(
				instance.connect(addr1).addPuzzle(sampleProblem2, solution2)
			).to.be.revertedWithCustomError(instance, "OwnableUnauthorizedAccount")

			expect(await instance.puzzleCounter()).to.equal(1)
			const expectedInitialPrice = ethers.parseEther("0.001")

			const puzzle = await instance.puzzlesById(0)
			expect(puzzle.fen).to.equal(sampleProblem1)
			expect(puzzle.price).to.equal(expectedInitialPrice)
			expect(puzzle.solution).to.equal(solution1)
			expect(puzzle.solveCount).to.equal(0)
			expect(puzzle.unlockCount).to.equal(0)
			expect(puzzle.staked).to.equal(0)
			expect(puzzle.activeAttemptCount).to.equal(0)
		})
	})

	describe("Attempt to solve a puzzle", function () {
		const solution1 = hashed(sampleSolution1)
		const solution2 = hashed(sampleSolution2)

		beforeEach(async function () {
			await instance.addPuzzle(sampleProblem1, solution1)
			await instance.addPuzzle(sampleProblem2, solution2)
		})

		it("Without unlocking first", async function () {
			const sig = await owner.signMessage(solution1)
			await expect(instance.solvePuzzle(0, solution1, sig))
				.to.be.revertedWithCustomError(instance, "PuzzleLocked")
				.withArgs(0)
			expect(await instance.getStatus(0, owner.address)).to.equal(0)
		})

		it("Without giving adequate amount for unlocking", async function () {
			const wrongPrice = ethers.parseEther("0.0001")
			await expect(instance.unlockPuzzle(0, { value: wrongPrice })).to.be
				.reverted
			expect(await instance.getStatus(0, owner.address)).to.equal(0)
		})

		it("Properly unlocks and solves the problem", async function () {
			const puzzleToSolve = await instance.puzzlesById(0)
			const prevBalance = await ethers.provider.getBalance(addr1)

			const unlockValue = puzzleToSolve.price
			await instance.connect(addr1).unlockPuzzle(0, { value: unlockValue })
			expect(await instance.getStatus(0, addr1.address)).to.equal(1)
			const newBalance = await ethers.provider.getBalance(addr1)
			expect(prevBalance - newBalance).to.be.greaterThan(unlockValue) // accounting gas price

			const sig = await generateSignature(solution1)
			const accountBalance1 = await ethers.provider.getBalance(addr1)
			await expect(instance.connect(addr1).solvePuzzle(0, solution1, sig))
				.to.emit(instance, "TransferSingle")
				.withArgs(
					addr1.address, // operator
					ethers.ZeroAddress, // from
					addr1.address, // to
					0, // id
					1 // value
				)
			expect(await instance.balanceOf(addr1.address, 0)).to.equal(1)
			expect(await instance.getStatus(0, addr1.address)).to.equal(2)

			const puzzleRefreshed = await instance.puzzlesById(0)
			expect(puzzleRefreshed.price).to.be.equal((unlockValue * 125n) / 100n)
			expect(await instance.accountBalance(addr1.address)).to.equal(
				puzzleToSolve.price
			)

			await instance.connect(addr1).withdraw()
			const accountBalance2 = await ethers.provider.getBalance(addr1)
			const bounty = ethers.parseEther("0.001")
			expect(accountBalance2 - accountBalance1)
				.to.be.lessThan(bounty)
				.to.be.greaterThan(bounty / 2n) // accounting for gas payment
		})

		it("Incorrectly signed", async function () {
			const puzzle = await instance.puzzlesById(0)
			const unlockValue = puzzle.price
			await instance.connect(addr1).unlockPuzzle(0, { value: unlockValue })

			const messageHash = ethers.solidityPackedKeccak256(["bytes"], [solution1])
			const solutionHashBytes = ethers.getBytes(messageHash)
			const sig = await addr1.signMessage(solutionHashBytes)
			await expect(
				instance.connect(addr1).solvePuzzle(0, solution1, sig)
			).to.be.revertedWithCustomError(instance, "NotAuthorized")

			const puzzleRefreshed = await instance.puzzlesById(0)
			expect(puzzleRefreshed.price).to.be.equal(unlockValue)
		})

		it("Incorrectly solved the problem", async function () {
			const puzzle = await instance.puzzlesById(0)

			const unlockValue = puzzle.price
			await instance.connect(addr1).unlockPuzzle(0, { value: unlockValue })

			const sig = await generateSignature(solution2)
			await expect(
				instance.connect(addr1).solvePuzzle(0, solution2, sig)
			).to.not.emit(instance, "TransferSingle")
			expect(await instance.balanceOf(addr1.address, 0)).to.equal(0)
		})

		it("Attempts solve problem that was previously attempted", async function () {
			const puzzle = await instance.puzzlesById(0)
			const unlockValue = puzzle.price
			await instance.unlockPuzzle(0, { value: unlockValue })
			const sig = await generateSignature(solution1)
			await instance.solvePuzzle(0, solution1, sig)

			const puzzleNew = await instance.puzzlesById(0)
			const unlockValue2 = puzzleNew.price
			expect(unlockValue2).to.be.equal((unlockValue * 125n) / 100n)
			await expect(instance.unlockPuzzle(0, { value: unlockValue2 }))
				.to.be.revertedWithCustomError(instance, "AlreadyUnlocked")
				.withArgs(0)
			await expect(instance.solvePuzzle(0, solution1, sig))
				.to.be.revertedWithCustomError(instance, "PuzzleSolved")
				.withArgs(0)
		})

		it("Properly disperses funds when problem incorrectly solved", async function () {
			let puzzle = await instance.puzzlesById(0)
			let unlockValue = puzzle.price
			expect(await instance.getStatus(0, owner.address)).to.equal(0)
			await instance.unlockPuzzle(0, { value: unlockValue })
			expect(await instance.getStatus(0, owner.address)).to.equal(1)
			const sig = await generateSignature(solution1)
			await instance.solvePuzzle(0, solution1, sig)
			expect(await instance.getStatus(0, owner.address)).to.equal(2)
			expect(await instance.accountBalance(owner.address)).to.be.equal(
				unlockValue
			)
			const oldBalance = await ethers.provider.getBalance(owner.address)

			puzzle = await instance.puzzlesById(0)
			unlockValue = puzzle.price
			expect(await instance.getStatus(0, addr1.address)).to.equal(0)
			await instance.connect(addr1).unlockPuzzle(0, { value: unlockValue })
			expect(await instance.getStatus(0, addr1.address)).to.equal(1)
			const sig2 = await generateSignature(solution2)
			await instance.connect(addr1).solvePuzzle(0, solution2, sig2)
			expect(await instance.getStatus(0, addr1.address)).to.equal(3)

			expect(await instance.accountBalance(owner.address)).to.be.greaterThan(
				unlockValue
			)
			await instance.withdraw()
			const newBalance = await ethers.provider.getBalance(owner)
			expect(newBalance - oldBalance).to.be.greaterThan(0)
		})

		it("Puzzle expires when unsolved", async function () {
			let puzzle = await instance.puzzlesById(0)
			const unlockValue = puzzle.price
			expect(await instance.getStatus(0, owner.address)).to.equal(0)
			await instance.unlockPuzzle(0, { value: unlockValue })
			expect(await instance.getStatus(0, owner.address)).to.equal(1)
			await instance.connect(addr1).unlockPuzzle(0, { value: unlockValue })
			const sig = await generateSignature(solution1)
			await instance.connect(addr1).solvePuzzle(0, solution1, sig)
			expect(await instance.getStatus(0, addr1.address)).to.equal(2)

			await time.increase(3600 * 2) // 2 hours advance

			await expect(instance.solvePuzzle(0, solution1, sig))
				.to.be.revertedWithCustomError(instance, "PuzzleExpired")
				.withArgs(0)

			puzzle = await instance.puzzlesById(0)
			expect(puzzle.activeAttemptCount).to.equal(2)
			expect(puzzle.solveCount).to.equal(1)
			expect(puzzle.staked).to.equal(unlockValue * 2n)

			const userBalance = await instance.accountBalance(addr1.address)
			expect(userBalance).to.equal(unlockValue)

			await instance.checkExpired(0)
			expect(await instance.getStatus(0, owner.address)).to.equal(3)
			const userBalance2 = await instance.accountBalance(addr1.address)
			expect(userBalance2).to.be.greaterThan(unlockValue)
		})
	})

	describe("Statistics", async function () {
		const players = 5
		let price1 = ethers.parseEther("0.001")
		let price2 = ethers.parseEther("0.001")
		let solves1 = 0
		let solves2 = 0
		const scoreCount = new Map()

		const solution1 = hashed(sampleSolution1)
		const solution2 = hashed(sampleSolution2)

		async function simulateSolving() {
			for (let i = 0; i < players; i++) {
				const signer = rest[i]
				const puzzle1 = await instance.puzzlesById(0)
				let unlockValue = puzzle1.price
				await instance.connect(signer).unlockPuzzle(0, { value: unlockValue })
				const skip1 = Math.random() < 0.5
				if (!skip1) {
					const sig = await generateSignature(solution1)
					await instance.connect(signer).solvePuzzle(0, solution1, sig)
					price1 = (price1 * 125n) / 100n
					solves1++
					if (scoreCount.has(signer.address)) {
						scoreCount.set(signer.address, scoreCount.get(signer.address) + 1)
					} else {
						scoreCount.set(signer.address, 1)
					}
				}

				const puzzle2 = await instance.puzzlesById(1)
				unlockValue = puzzle2.price
				await instance.connect(signer).unlockPuzzle(1, { value: unlockValue })
				const skip2 = Math.random() < 0.5
				if (!skip2) {
					const sig = await generateSignature(solution2)
					await instance.connect(signer).solvePuzzle(1, solution2, sig)
					price2 = (price2 * 125n) / 100n
					solves2++
					if (scoreCount.has(signer.address)) {
						scoreCount.set(signer.address, scoreCount.get(signer.address) + 1)
					} else {
						scoreCount.set(signer.address, 1)
					}
				}
			}
		}

		beforeEach(async function () {
			await instance.addPuzzle(sampleProblem1, solution1)
			await instance.addPuzzle(sampleProblem2, solution2)
			await simulateSolving()
		})

		it("Able to construct points leaderboard", async function () {
			await time.increase(3600 * 2) // 2 hours advance

			let puzzle1 = await instance.puzzlesById(0)
			let puzzle2 = await instance.puzzlesById(1)

			expect(puzzle1.solveCount).to.be.equal(solves1)
			expect(puzzle2.solveCount).to.be.equal(solves2)

			expect(puzzle1.unlockCount).to.be.equal(players)
			expect(puzzle2.unlockCount).to.be.equal(players)

			expect(puzzle1.price).to.be.equal(price1)
			expect(puzzle2.price).to.be.equal(price2)

			const solvers1 = await instance.getSolvers(0)
			const solvers2 = await instance.getSolvers(1)
			const scoreCount_ = new Map()
			solvers1.concat(solvers2).forEach((a) => {
				if (scoreCount_.has(a)) {
					scoreCount_.set(a, scoreCount_.get(a) + 1)
				} else {
					scoreCount_.set(a, 1)
				}
			})
			expect(scoreCount_).to.be.deep.equal(scoreCount)

			const prevBalances = []
			for (let i = 0; i < players; i++) {
				const signer = rest[i]
				const prevAccountBalance = await instance.accountBalance(signer.address)
				prevBalances.push(prevAccountBalance)
			}

			await instance.checkExpiredAll()
			puzzle1 = await instance.puzzlesById(0)
			puzzle2 = await instance.puzzlesById(1)
			expect(puzzle1.expiredCount).to.be.equal(5 - solves1)
			expect(puzzle2.expiredCount).to.be.equal(5 - solves2)

			for (let i = 0; i < players; i++) {
				const signer = rest[i]
				const solved = (await instance.getStatus(0, signer.address)) == 2n
				if (solved) {
					const prevAccountBalance = prevBalances[i]
					const newAccountBalance = await instance.accountBalance(
						signer.address
					)
					expect(newAccountBalance).to.greaterThanOrEqual(prevAccountBalance)
				}
			}
		})
	})
})

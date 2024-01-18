import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import { hashed } from "../utils/encoding"
import { FENToBoard } from "../utils/parser"
import { ethers } from "hardhat"

const sampleSolution1 = "Nf6+"
const solution1Bytes = ethers.toUtf8Bytes(sampleSolution1)

const sampleProblem2 = "1rb4r/pkPp3p/1b1P3n/1Q6/N3Pp2/8/P1P3PP/7K w - - 1 1"
const sampleSolution2 = "Qd5+"
const solution2 = hashed(sampleSolution2)
const solution2Bytes = ethers.toUtf8Bytes(sampleSolution2)
console.log("bytes", solution2Bytes)

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
	if (hre.network.name == "hardhat") {
		// Only run for test/dev environments
		const { deployments } = hre
		const [deployer, creator, player1, player2] = await hre.ethers.getSigners()
		const boardDeployment = await deployments.get("Board")
		const board = await hre.ethers.getContractAt(
			"Board",
			boardDeployment.address
		)
		await board
			.connect(creator)
			.addPuzzle(sampleProblem2, solution2, FENToBoard(sampleProblem2))
		await board.connect(player1).submitSolution(0, solution1Bytes)
		await board.connect(player1).submitSolution(1, solution2Bytes)

		await board.connect(player2).submitSolution(0, solution1Bytes)
		await board
			.connect(player2)
			.submitSolution(1, hre.ethers.toUtf8Bytes("abcd"))
		await board.connect(player1).mint(0, { value: BigInt(0.02e18) })

		await board
			.connect(creator)
			.addPuzzle(sampleProblem2, solution2, FENToBoard(sampleProblem2))
	}
}

func.tags = ["Dev"]
func.dependencies = ["AddPuzzle"]
export default func

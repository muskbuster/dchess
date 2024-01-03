import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import { hashed } from "../utils/encoding"
import { FENToBoard } from "../utils/fiveOutOfNineArt"

const sampleProblem1 = ""
const sampleSolution1 = ""

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
	const solution1 = hashed(sampleSolution1)
	const move1 = FENToBoard(sampleProblem1)

	const { deployments } = hre
	const boardDeployment = await deployments.get("Board")
	const board = await hre.ethers.getContractAt("Board", boardDeployment.address)

	if (!sampleProblem1) {
		console.log("input sample problem and solution")
		process.exit(1)
	}

	await board.addPuzzle(sampleProblem1, solution1, move1)
	console.log("deployed puzzle", await board.puzzlesById(0))
}

func.tags = ["AddPuzzle"]
func.dependencies = ["Board"]
export default func

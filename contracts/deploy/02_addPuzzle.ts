import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import { hashed } from "../utils/encoding"
import { FENToBoard } from "../utils/fiveOutOfNineArt"
import { SAMPLE_PROBLEM_1, SAMPLE_SOLUTION_1 } from "./00_config"

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
	let sampleSolution1 = SAMPLE_SOLUTION_1
	let sampleProblem1 = SAMPLE_PROBLEM_1
	if (hre.network.name == "hardhat") {
		sampleProblem1 =
			"r2qkb1r/pp2nppp/3p4/2pNN1B1/2BnP3/3P4/PPP2PPP/R2bK2R w KQkq - 1 1"
		sampleSolution1 = "Nf6+"
	}

	const solution1 = hashed(sampleSolution1)
	const move1 = FENToBoard(sampleProblem1)

	const { deployments } = hre
	const boardDeployment = await deployments.get("Board")
	const board = await hre.ethers.getContractAt("Board", boardDeployment.address)

	await board.addPuzzle(sampleProblem1, solution1, move1)
	console.log("deployed puzzle", await board.puzzlesById(0))
}

func.tags = ["AddPuzzle"]
func.dependencies = ["Board"]
export default func

import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"

const sampleProblem1 = ""
const sampleSolution1 = ""

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
	const { deployments } = hre
	const boardDeployment = await deployments.get("Board")
	const board = await hre.ethers.getContractAt("Board", boardDeployment.address)

	if (!sampleProblem1 || !sampleSolution1) {
		console.log("input sample problem and solution")
		process.exit(1)
	}

	await board.addPuzzle(sampleProblem1, sampleSolution1)
}

func.tags = ["AddPuzzle"]
func.dependencies = ["Board"]
export default func

import { DeployFunction } from "hardhat-deploy/types"
import { HardhatRuntimeEnvironment } from "hardhat/types"

export const SAMPLE_PROBLEM_1 = ""
export const SAMPLE_SOLUTION_1 = ""

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
	if (hre.network.name !== "hardhat") {
		if (!SAMPLE_PROBLEM_1 || SAMPLE_SOLUTION_1) {
			console.log("input sample problem and solution")
			process.exit(1)
		}
	}
}
func.tags = ["Config"]
export default func

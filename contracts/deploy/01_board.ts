import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
	const { deployments } = hre
	const [deployer] = await hre.getUnnamedAccounts()

	await deployments.deploy("Board", {
		from: deployer,
		args: [deployer],
	})

	if (hre.network.name != "hardhat") {
		const board = await deployments.get("Board")
		console.log(`Board deployed to ${board.address} with owner as ${deployer}`)
	}
}

func.tags = ["Board"]
export default func

import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { deployments } = hre;
    const [deployer] = await hre.ethers.getSigners();

    await deployments.deploy("DChess", {
        from: deployer.address,
        args: [deployer.address],
    });

    const dChess = await deployments.get("DChess");
    console.log(
        `DChess deployed to ${dChess.address} with owner as ${deployer.address}`,
    );
};

func.tags = ["Deploy"];
export default func;

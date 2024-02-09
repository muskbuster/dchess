import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { deployments } = hre;
    const [deployer] = await hre.getUnnamedAccounts();

    await deployments.deploy("DChess", {
        from: deployer,
        args: [deployer],
    });

    const dChess = await deployments.get("DChess");
    console.log(
        `DChess deployed to ${dChess.address} with owner as ${deployer}`,
    );

    await deployments.deploy("SimpleChessToken", {
        from: deployer,
        args: ["TestChess", "CHESS"],
    });

    const simpleChessToken = await deployments.get("SimpleChessToken");
    console.log(
        `SimpleChessToken deployed to ${simpleChessToken.address} with owner as ${deployer}`,
    );
};

func.tags = ["Deploy"];
export default func;

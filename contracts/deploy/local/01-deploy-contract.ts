import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { readFileSync } from "fs";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { deployments } = hre;
    const [deployer] = await hre.getUnnamedAccounts();

    await deployments.deploy("ThreeOutOfNineART", {
        from: deployer,
        args: [deployer],
    });
    const threeOutOfNineARTDeployment =
        await deployments.get("ThreeOutOfNineART");
    console.log(
        `ThreeOutOfNineART deployed to ${threeOutOfNineARTDeployment.address}`,
    );

    const threeOutOfNineART = await hre.ethers.getContractAt(
        "ThreeOutOfNineART",
        threeOutOfNineARTDeployment.address,
    );
    const svg = readFileSync("./data/retro.svg");
    await threeOutOfNineART.setImage(svg.toString());
    console.log("Updated SVG art");

    await deployments.deploy("DChess", {
        from: deployer,
        args: [deployer, threeOutOfNineARTDeployment.address],
    });
    const dChess = await deployments.get("DChess");
    console.log(
        `DChess deployed to ${dChess.address} with owner as ${deployer}`,
    );

    await deployments.deploy("SimpleChessToken", {
        from: deployer,
        args: ["TestChess", "CHESS", threeOutOfNineARTDeployment.address],
    });
    const simpleChessToken = await deployments.get("SimpleChessToken");
    console.log(
        `SimpleChessToken deployed to ${simpleChessToken.address} with owner as ${deployer}`,
    );
};

func.tags = ["Deploy"];
export default func;

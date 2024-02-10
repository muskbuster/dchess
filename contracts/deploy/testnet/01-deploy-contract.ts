import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { readFileSync } from "fs";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    console.log("TESTNET DEPLOYMENT");
    const { deployments } = hre;
    const [deployer] = await hre.ethers.getSigners();

    await deployments.deploy("ThreeOutOfNineART", {
        from: deployer.address,
        args: [deployer.address],
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
    await threeOutOfNineART.setImage(svg.toString(), { gasLimit: 1000000 });
    console.log("Updated SVG art");

    await deployments.deploy("DChess", {
        from: deployer.address,
        args: [deployer.address, threeOutOfNineARTDeployment.address],
    });
    const dChess = await deployments.get("DChess");
    console.log(
        `DChess deployed to ${dChess.address} with owner as ${deployer.address}`,
    );
};

func.tags = ["Deploy"];
export default func;

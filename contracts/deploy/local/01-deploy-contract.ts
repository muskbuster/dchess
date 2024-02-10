import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const ImageUrl =
    "https://maroon-petite-shrew-493.mypinata.cloud/ipfs/QmbG4pjnDQyWeT5ZU822DGJGr1afKwViPYNKFi9pwo4QwA";

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
    await threeOutOfNineART.setImageUrl(ImageUrl);
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

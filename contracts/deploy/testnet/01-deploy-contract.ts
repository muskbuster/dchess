import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const ImageUrl =
    "https://maroon-petite-shrew-493.mypinata.cloud/ipfs/QmbG4pjnDQyWeT5ZU822DGJGr1afKwViPYNKFi9pwo4QwA";

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
    const response = await threeOutOfNineART.setImageUrl(ImageUrl);
    response.wait();
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

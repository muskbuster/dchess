import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    console.log("MAINNET PWNED TOKEN DEPLOYMENT");
    const { deployments } = hre;
    const [deployer] = await hre.ethers.getSigners();

    const todayDate = new Date();
    const timestampIn4Years = Math.floor(
        todayDate.setFullYear(todayDate.getFullYear() + 4) / 1000,
    );

    await deployments.deploy("PwnedToken", {
        from: deployer.address,
        args: [timestampIn4Years],
    });
    const PwnedToken = await deployments.get("PwnedToken");
    console.log(
        `PwnedToken deployed to ${PwnedToken.address} with owner as ${deployer.address} with params ${timestampIn4Years}`,
    );
};

func.tags = ["DeployPwned"];
export default func;

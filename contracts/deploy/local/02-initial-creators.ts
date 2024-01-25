import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { getMerkleRoot } from "../../utils/whitelistingHelper";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    if (hre.network.name != "hardhat") return; // only run locally

    const { deployments } = hre;
    const dChessDeployment = await deployments.get("DChess");
    const dChess = await hre.ethers.getContractAt(
        "DChess",
        dChessDeployment.address,
    );

    const [owner, creator1, creator2, creator3] = await hre.ethers.getSigners();

    const root = getMerkleRoot([creator1.address, creator2.address]);
    await dChess.setMerkleRoot(root);

    console.log("2 creators whitelisted");
};

func.tags = ["SetupCreators"];
func.dependencies = ["Deploy"];
export default func;

import { getMerkleRoot } from "../utils/whitelistingHelper";
import { deployments, ethers } from "hardhat";

import whitelistedCreators from "../data/whitelistedCreators.json";

export async function whitelist() {
    const dChessDeployment = await deployments.get("DChess");
    const dChess = await ethers.getContractAt(
        "DChess",
        dChessDeployment.address,
    );

    const root = getMerkleRoot(whitelistedCreators);
    await dChess.setMerkleRoot(root);

    console.log("Merkle root updated");
}

whitelist();

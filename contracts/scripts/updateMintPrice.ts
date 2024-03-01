import { parseEther } from "ethers";
import { deployments, ethers } from "hardhat";

export async function updateMintPrice(value: string) {
    const dChessDeployment = await deployments.get("DChess");
    const dChess = await ethers.getContractAt(
        "DChess",
        dChessDeployment.address,
    );

    await dChess.setTokenMintPrice(parseEther("0.001"));

    console.log("Mint price updated");
}

updateMintPrice("0.001");

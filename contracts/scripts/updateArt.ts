import { deployments, ethers } from "hardhat";

export async function updateArt(value: string) {
    const threeOutOfNineARTDeployment =
        await deployments.get("ThreeOutOfNineART");
    const threeOutOfNineART = await ethers.getContractAt(
        "ThreeOutOfNineART",
        threeOutOfNineARTDeployment.address,
    );

    const response = await threeOutOfNineART.setImageUrl(value);
    await response.wait();

    console.log("Art updated");
}

// updateArt("");

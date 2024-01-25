import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { FENToBoard } from "../../utils/boardEncoder";
import { ethers } from "hardhat";
import { getProof } from "../../utils/whitelistingHelper";

import puzzleSet from "../../data/puzzleSet.json";

function hashed(str: string) {
    // first convert to bytes
    const _bytes = ethers.toUtf8Bytes(str);
    // then hash it
    return ethers.keccak256(_bytes);
}

const ATTEMPT_COUNT = 50;

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    return; // temporarily disabling
    // if (hre.network.name != "hardhat") return; // only run locally

    const { deployments } = hre;
    const dChessDeployment = await deployments.get("DChess");
    const dChess = await hre.ethers.getContractAt(
        "DChess",
        dChessDeployment.address,
    );

    const [, , , , ...users] = await hre.ethers.getSigners();

    for (let i = 0; i < ATTEMPT_COUNT; i++) {
        const randomPuzzleIndex = Math.floor(Math.random() * puzzleSet.length);

        // const problem = puzzleSet[randomPuzzleIndex][0];
        const solution = puzzleSet[randomPuzzleIndex][1];

        const solutionHashed = hashed(solution);
        const wrongAnswer = ethers.toUtf8Bytes("abcd");

        const randomUser = users[Math.floor(Math.random() * users.length)];
        const correctAnswer = Math.floor(Math.random() * 2) == 1;

        await dChess
            .connect(randomUser)
            .submitSolution(
                randomPuzzleIndex,
                correctAnswer ? solutionHashed : wrongAnswer,
            );
    }

    console.log("Bootstrapped activity");
};

func.tags = ["BootstrapActivity"];
func.dependencies = ["AddPuzzles"];
export default func;

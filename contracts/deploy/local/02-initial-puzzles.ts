import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { FENToBoard } from "../../utils/boardEncoder";
import { ethers } from "hardhat";

import testPuzzleSet from "../../data/testPuzzleSet.json";

function hashed(str: string) {
    return ethers.keccak256(ethers.toUtf8Bytes(str));
}

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    if (hre.network.name != "hardhat") return; // only run locally

    const { deployments } = hre;
    const dChessDeployment = await deployments.get("DChess");
    const dChess = await hre.ethers.getContractAt(
        "DChess",
        dChessDeployment.address,
    );

    const [owner, player1, player2, player3] = await hre.ethers.getSigners();
    const players = [player1, player2, player3];

    await Promise.all(
        testPuzzleSet.map(async (puzzle) => {
            const problem = puzzle[0];
            const solution = puzzle[1];
            const description = puzzle[2];

            const boardPosition = FENToBoard(problem);
            const solutionHashed = hashed(solution);

            const randomCreator =
                players[Math.floor(Math.random() * players.length)];

            await dChess
                .connect(randomCreator)
                .addPuzzle(problem, solutionHashed, boardPosition, description);
        }),
    );

    const count = await dChess.internalTokenCounter();

    console.log(count + " puzzles added");
};

func.tags = ["AddPuzzles"];
func.dependencies = ["Deploy"];
export default func;

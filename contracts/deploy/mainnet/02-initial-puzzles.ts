import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { FENToBoard } from "../../utils/boardEncoder";
import { ethers } from "hardhat";

import puzzleSet from "../../data/mainnetPuzzleSet.json";

function hashed(str: string) {
    return ethers.keccak256(ethers.toUtf8Bytes(str));
}

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { deployments } = hre;
    const dChessDeployment = await deployments.get("DChess");
    const dChess = await hre.ethers.getContractAt(
        "DChess",
        dChessDeployment.address,
    );

    const [owner] = await hre.ethers.getSigners();

    let puzzleCount = 0;
    for (let puzzle of puzzleSet) {
        const problem = puzzle[0];
        const solution = puzzle[1];
        const description = puzzle[2];

        const boardPosition = FENToBoard(problem);
        const solutionHashed = hashed(solution);

        try {
            const response = await dChess
                .connect(owner)
                .addPuzzle(problem, solutionHashed, boardPosition, description);
            await response.wait();
            console.log("puzzle added: ", puzzleCount + 1);
        } catch (e) {
            console.log(e);
        }
        puzzleCount++;
    }

    const count = await dChess.internalTokenCounter();

    console.log(count + " puzzles added");
};

func.tags = ["AddPuzzles"];
func.dependencies = ["Deploy"];
export default func;

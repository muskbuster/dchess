import puzzleSet from "../data/puzzleSet.json";
import { FENToBoard } from "../utils/boardEncoder";
import { ethers, network, deployments } from "hardhat";
import { getProof } from "../utils/whitelistingHelper";

function hashed(str: string) {
    return ethers.keccak256(ethers.toUtf8Bytes(str));
}

export async function addPuzzles() {
    if (network.name == "hardhat") {
        console.log("Unable to run on hardhat network");
        return;
    }

    const [owner, creator1, creator2, creator3] = await ethers.getSigners();
    if (!creator1 || !creator2 || !creator3) {
        console.log("Creator private keys missing!");
        return;
    }

    const dChessDeployment = await deployments.get("DChess");
    const dChess = await ethers.getContractAt(
        "DChess",
        dChessDeployment.address,
    );

    const creatorArr = [creator1, creator2, creator3];

    await Promise.all(
        puzzleSet.map(async (puzzle) => {
            const problem = puzzle[0];
            const solution = puzzle[1];
            const description = puzzle[2];

            const boardPosition = FENToBoard(problem);
            const solutionHashed = hashed(solution);

            const randomCreator =
                creatorArr[Math.floor(Math.random() * creatorArr.length)];

            await dChess.connect(randomCreator).addPuzzle(
                problem,
                solutionHashed,
                boardPosition,
                description,
                getProof(
                    creatorArr.map((c) => c.address),
                    randomCreator.address,
                ),
            );
        }),
    );

    const count = await dChess.internalTokenCounter();

    console.log(count + " puzzles added");
}

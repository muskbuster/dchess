import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers } from "hardhat";

import puzzleSet from "../../data/puzzleSet.json";

const WRONG_ANSWER = ethers.toUtf8Bytes("a3");
const MINT_COUNT_DECISION = [1, 1, 1, 1, 1, 1, 2, 2, 3];

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { deployments } = hre;
    const dChessDeployment = await deployments.get("DChess");
    const dChess = await hre.ethers.getContractAt(
        "DChess",
        dChessDeployment.address,
    );

    const [, ...players] = await hre.ethers.getSigners();

    let playerIndex = 0;
    for (let player of players) {
        let puzzleIndex = 0;
        for (let puzzle of puzzleSet) {
            const correctAnswer = ethers.toUtf8Bytes(puzzle[1]);
            const isPlayerCorrect = Math.floor(Math.random() * 2) == 1;
            try {
                const response = await dChess
                    .connect(player)
                    .submitSolution(
                        puzzleIndex,
                        isPlayerCorrect ? correctAnswer : WRONG_ANSWER,
                    );
                await response.wait();

                console.log(
                    `player ${playerIndex} attempted puzzle ${puzzleIndex} ${isPlayerCorrect ? "correcly" : "incorrectly"}`,
                );

                // also mint NFTs if correct
                if (isPlayerCorrect) {
                    const mintCountChoice =
                        MINT_COUNT_DECISION[
                            Math.floor(
                                Math.random() * MINT_COUNT_DECISION.length,
                            )
                        ];

                    try {
                        const response = await dChess
                            .connect(player)
                            .mint(puzzleIndex, mintCountChoice);
                        await response.wait();
                        console.log(
                            `player ${playerIndex} minted puzzle ${puzzleIndex} ${mintCountChoice} times`,
                        );
                    } catch (e) {
                        console.log("minting failed");
                        console.log(e);
                    }
                }
            } catch (e) {
                console.log("attempting failed");
                console.log(e);
            }

            puzzleIndex++;
        }
        playerIndex++;
    }

    console.log("Bootstrapped activity");
};

func.tags = ["BootstrapActivity"];
func.dependencies = ["AddPuzzles"];
export default func;

import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers } from "hardhat";

import puzzleSet from "../../data/testnetPuzzleSet.json";
import { isError, parseEther } from "ethers";

const WRONG_ANSWER = ethers.toUtf8Bytes("a3");
const MINT_COUNT_DECISION = [0, 1, 2, 3, 5, 8];

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { deployments } = hre;
    const dChessDeployment = await deployments.get("DChess");
    const dChess = await hre.ethers.getContractAt(
        "DChess",
        dChessDeployment.address,
    );

    const [owner, ...players] = await hre.ethers.getSigners();

    // first lower the price of mint (otherwise funds will get drained)
    await dChess.setTokenMintPrice(parseEther("0.0001"));
    const mintValue = await dChess.tokenMintPrice();

    // iterate through players and attempt all puzzles (except owner)
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
                    `player ${playerIndex} attempted puzzle ${puzzleIndex} ${isPlayerCorrect ? "correctly" : "incorrectly"}`,
                );

                // also mint NFTs if correct
                if (isPlayerCorrect) {
                    const mintCountChoice =
                        MINT_COUNT_DECISION[
                            Math.floor(
                                Math.random() * MINT_COUNT_DECISION.length,
                            )
                        ];

                    if (mintCountChoice == 0) continue;

                    try {
                        const response = await dChess
                            .connect(player)
                            .mint(puzzleIndex, mintCountChoice, {
                                value: mintValue * BigInt(mintCountChoice),
                            });
                        await response.wait();
                        console.log(
                            `player ${playerIndex} minted puzzle ${puzzleIndex} ${mintCountChoice} times`,
                        );
                    } catch (e) {
                        console.log("minting failed");
                        if (isError(e, "CALL_EXCEPTION")) {
                            console.log(dChess.interface.parseError(e.data!));
                        }
                    }
                }
            } catch (e) {
                console.log("attempting failed");
                if (isError(e, "CALL_EXCEPTION")) {
                    console.log(dChess.interface.parseError(e.data!));
                }
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

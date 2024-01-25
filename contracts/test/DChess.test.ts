import { expect } from "chai";
import { deployments, ethers } from "hardhat";

import { DChess } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { FENToBoard } from "../utils/boardEncoder";
import { parseEther } from "ethers";

import { getMerkleRoot, getProof } from "../utils/whitelistingHelper";

function hashed(str: string) {
    return ethers.keccak256(ethers.toUtf8Bytes(str));
}

const INTERFACE_ID_IERC1155 = "0xd9b67a26";
const DEFAULT_RATING = 1000;
const PUZZLE_COUNT = 3;

describe("DChess", function () {
    let instance: DChess;
    let owner: HardhatEthersSigner;
    let player1: HardhatEthersSigner;
    let player2: HardhatEthersSigner;
    let player3: HardhatEthersSigner;
    let creator1: HardhatEthersSigner;
    let creator2: HardhatEthersSigner;
    let creator3: HardhatEthersSigner;
    let rest: Array<HardhatEthersSigner>;
    let whitelistedCreators: string[];

    const setup = async () => {
        await deployments.fixture(["AddPuzzles"]);
        const dChessDeployment = await deployments.get("DChess");
        instance = (await ethers.getContractAt(
            "DChess",
            dChessDeployment.address,
        )) as DChess;
    };

    const solution1Bytes = ethers.toUtf8Bytes("Nf6+");
    const solution2Bytes = ethers.toUtf8Bytes("Qd5+");
    const solution3Bytes = ethers.toUtf8Bytes("Qb8+");

    before(async function () {
        await setup();
        [owner, creator1, creator2, creator3, player1, player2, player3] =
            await ethers.getSigners();
        whitelistedCreators = [creator1.address, creator2.address];
        expect(await instance.internalTokenCounter()).to.equal(PUZZLE_COUNT);
    });

    describe("Deployment", function () {
        it("Should support ERC1155", async function () {
            expect(await instance.supportsInterface(INTERFACE_ID_IERC1155)).to
                .be.true;
        });

        it("Should set the right owner", async function () {
            expect(await instance.owner()).to.equal(owner.address);
        });

        it("Should have default settings", async function () {
            expect(await instance.tokenMintPrice()).to.equal(
                parseEther("0.002"),
            );
            expect(await instance.kFactor()).to.equal(50);
            expect(await instance.platformFee()).to.equal(40);
        });
    });

    describe("Adding a new puzzle", function () {
        const problem =
            "r2qkb1r/pp2nppp/3p4/2pNN1B1/2BnP3/3P4/PPP2PPP/R2bK2R w KQkq - 1 1";
        const rawSolution = "Nf6+";
        const solution = hashed(rawSolution);
        const metadata = FENToBoard(problem);
        const description = "White to play and something";

        it("Fails when creator not whitelisted", async function () {
            const proof = getProof(
                whitelistedCreators.concat([creator3.address]),
                creator3.address,
            );
            await expect(
                instance
                    .connect(creator3)
                    .addPuzzle(problem, solution, metadata, description, proof),
            )
                .to.be.revertedWithCustomError(instance, "UserNotAuthorized")
                .withArgs(creator3.address);
        });

        it("Fails when wrong proof given", async function () {
            const proof: string[] = [];
            await expect(
                instance
                    .connect(creator2)
                    .addPuzzle(problem, solution, metadata, description, proof),
            )
                .to.be.revertedWithCustomError(instance, "UserNotAuthorized")
                .withArgs(creator2.address);
        });

        it("Succeeds when whitelisted creator given correct proof", async function () {
            const currentCount = await instance.internalTokenCounter();
            const proof = getProof(whitelistedCreators, creator2.address);
            await expect(
                instance
                    .connect(creator2)
                    .addPuzzle(problem, solution, metadata, description, proof),
            )
                .to.emit(instance, "PuzzleAdded")
                .withArgs(
                    currentCount,
                    problem,
                    solution,
                    metadata,
                    creator2.address,
                );

            expect(await instance.internalTokenCounter()).to.equal(
                currentCount + 1n,
            );
            const puzzle = await instance.puzzlesById(currentCount);
            expect(puzzle.fen).to.equal(problem);
            expect(puzzle.solution).to.equal(solution);
            expect(puzzle.rating).to.equal(DEFAULT_RATING);
            expect(puzzle.creator).to.equal(creator2.address);
        });

        it("Succeeds when updating merkle root with new creator", async function () {
            const newWhitelist = whitelistedCreators.concat([creator3.address]);
            const newMerkleRoot = getMerkleRoot(newWhitelist);
            expect(await instance.setMerkleRoot(newMerkleRoot)).to.not.be
                .reverted;

            const proof = getProof(newWhitelist, creator3.address);
            await expect(
                instance
                    .connect(creator3)
                    .addPuzzle(problem, solution, metadata, description, proof),
            )
                .to.emit(instance, "PuzzleAdded")
                .withArgs(4, problem, solution, metadata, creator3.address);
        });
    });

    describe("Solving a puzzle", function () {
        it("Fails when giving an incorrect solution", async () => {
            await expect(
                instance
                    .connect(player1)
                    .submitSolution(0, ethers.toUtf8Bytes("abcd")),
            )
                .to.emit(instance, "PuzzleAttempted")
                .withArgs(0, player1.address, ethers.toUtf8Bytes("abcd"))
                .to.emit(instance, "UserRatingChanged")
                .to.emit(instance, "PuzzleRatingChanged");

            const puzzle = await instance.puzzlesById(0);
            expect(puzzle.rating).to.be.greaterThan(1000);
            expect(await instance.userHasSolvedPuzzle(0, player1)).to.equal(
                false,
            );
            expect(await instance.userRatings(player1.address)).to.be.lessThan(
                1000,
            );
        });

        it("Fails when attempting twice", async () => {
            await expect(
                instance
                    .connect(player2)
                    .submitSolution(0, ethers.toUtf8Bytes("abcd")),
            )
                .to.emit(instance, "PuzzleAttempted")
                .withArgs(0, player2.address, ethers.toUtf8Bytes("abcd"))
                .to.emit(instance, "UserRatingChanged")
                .to.emit(instance, "PuzzleRatingChanged");
            await expect(
                instance.connect(player2).submitSolution(0, solution1Bytes),
            )
                .to.be.revertedWithCustomError(instance, "AlreadyAttempted")
                .withArgs(0);
        });

        it("Succeeds when giving a correct solution", async () => {
            await expect(
                instance.connect(player3).submitSolution(1, solution2Bytes),
            )
                .to.emit(instance, "PuzzleAttempted")
                .withArgs(1, player3.address, solution2Bytes)
                .to.emit(instance, "PuzzleSolved")
                .withArgs(1, player3.address)
                .to.emit(instance, "UserRatingChanged")
                .to.emit(instance, "PuzzleRatingChanged");

            const puzzle = await instance.puzzlesById(1);
            expect(puzzle.rating).to.be.lessThan(1000);
            expect(await instance.userHasSolvedPuzzle(1, player3)).to.equal(
                true,
            );
            expect(
                await instance.userRatings(player3.address),
            ).to.be.greaterThan(1000);
        });
    });

    describe("Minting an NFT", async () => {
        it("Fails when non-solver tries", async () => {
            const mintValue = await instance.tokenMintPrice();
            await expect(
                instance.connect(player1).mint(1, { value: mintValue }),
            )
                .to.be.revertedWithCustomError(instance, "PuzzleNotSolved")
                .withArgs(1);
        });

        it("Fails when not enough funds provided", async () => {
            const mintValue = await instance.tokenMintPrice();

            await expect(
                instance.connect(player1).submitSolution(1, solution2Bytes),
            ).to.emit(instance, "PuzzleSolved");
            await expect(
                instance.connect(player1).mint(1, { value: mintValue / 2n }),
            )
                .to.be.revertedWithCustomError(instance, "NotEnoughEtherSent")
                .withArgs(mintValue / 2n, mintValue);
        });

        it("Succeeds when solver tries", async () => {
            const platformFee = await instance.platformFee();
            const mintValue = await instance.tokenMintPrice();
            const puzzleCreatorAddress = (await instance.puzzlesById(2))[4];
            const creator = [creator1, creator2, creator3].find(
                (c) => c.address == puzzleCreatorAddress,
            ) as HardhatEthersSigner;
            const oldBalance = await ethers.provider.getBalance(creator);

            await expect(
                instance.connect(player1).submitSolution(2, solution3Bytes),
            ).to.emit(instance, "PuzzleSolved");
            await expect(
                instance.connect(player1).mint(2, { value: mintValue }),
            )
                .to.emit(instance, "TokenMinted")
                .withArgs(2, player1.address);

            expect(await ethers.provider.getBalance(creator)).to.equal(
                ((100n - platformFee) * mintValue) / 100n + oldBalance,
            );
        });
    });

    describe("Managing DChess", async () => {
        it("Fails when malicious actor tries to change protocol", async () => {
            await expect(instance.connect(creator1).setTokenMintPrice(0))
                .to.be.revertedWithCustomError(
                    instance,
                    "OwnableUnauthorizedAccount",
                )
                .withArgs(creator1.address);
            await expect(instance.connect(creator1).setKFactor(0))
                .to.be.revertedWithCustomError(
                    instance,
                    "OwnableUnauthorizedAccount",
                )
                .withArgs(creator1.address);
            await expect(instance.connect(creator1).setPlatformFee(0))
                .to.be.revertedWithCustomError(
                    instance,
                    "OwnableUnauthorizedAccount",
                )
                .withArgs(creator1.address);
            const newWhitelist = whitelistedCreators.concat([player1.address]);
            const newMerkleRoot = getMerkleRoot(newWhitelist);
            await expect(
                instance.connect(creator1).setMerkleRoot(newMerkleRoot),
            )
                .to.be.revertedWithCustomError(
                    instance,
                    "OwnableUnauthorizedAccount",
                )
                .withArgs(creator1.address);
        });

        it("Succeeds when owner changes protocol parameters", async () => {
            const puzzleCreatorAddress = (await instance.puzzlesById(1))[4];
            const creator = [creator1, creator2, creator3].find(
                (c) => c.address == puzzleCreatorAddress,
            ) as HardhatEthersSigner;
            const creatorBalance = await ethers.provider.getBalance(creator);
            const playerRatings = await instance.userRatings(player2);

            await expect(await instance.setTokenMintPrice(parseEther("1"))).to
                .not.be.reverted;
            await expect(await instance.setKFactor(0)).to.not.be.reverted;
            await expect(await instance.setPlatformFee(0)).to.not.be.reverted;

            await expect(
                instance.connect(player2).submitSolution(1, solution2Bytes),
            ).to.emit(instance, "PuzzleSolved");
            await expect(
                instance.connect(player2).mint(1, { value: parseEther("1") }),
            )
                .to.emit(instance, "TokenMinted")
                .withArgs(1, player2.address);

            expect(await ethers.provider.getBalance(creator)).to.equal(
                parseEther("1") + creatorBalance,
            );
            expect(await instance.userRatings(player2)).to.be.equal(
                playerRatings,
            );
        });

        it("Succeeds when owner takes profits", async () => {
            const mintValue = await instance.tokenMintPrice();
            const platformFee = await instance.platformFee();
            const ownerBalance = await ethers.provider.getBalance(owner);

            await expect(
                instance.connect(player3).submitSolution(2, solution3Bytes),
            ).to.emit(instance, "PuzzleSolved");
            await expect(
                instance.connect(player3).mint(2, { value: mintValue }),
            )
                .to.emit(instance, "TokenMinted")
                .withArgs(2, player3.address);

            expect(await ethers.provider.getBalance(owner)).to.equal(
                (platformFee / 100n) * mintValue + ownerBalance,
            );
        });
    });

    // Disabling the following tests (eventually delete)

    // Reason: Statistics will be not available from code anymore instead
    // it should be computed via events by leveraging a sub-graph.

    /*
    describe("Statistics", async function () {
        const players = 5;
        let solves1 = 0;
        let solves2 = 0;
        const scoreCount = new Map();

        const solution1 = hashed(sampleSolution1);
        const solution2 = hashed(sampleSolution2);

        async function simulateSolving() {
            for (let i = 0; i < players; i++) {
                const signer = rest[i];
                const skip1 = Math.random() < 0.5;
                if (!skip1) {
                    await instance
                        .connect(signer)
                        .submitSolution(0, solution1Bytes);
                    solves1++;
                    scoreCount.set(signer.address, 1);
                } else {
                    await instance
                        .connect(signer)
                        .submitSolution(0, ethers.toUtf8Bytes("abcd"));
                    scoreCount.set(signer.address, 0);
                }

                const skip2 = Math.random() < 0.5;
                if (!skip2) {
                    await instance
                        .connect(signer)
                        .submitSolution(1, solution2Bytes);
                    solves2++;
                    if (scoreCount.has(signer.address)) {
                        scoreCount.set(
                            signer.address,
                            scoreCount.get(signer.address) + 1,
                        );
                    } else {
                        scoreCount.set(signer.address, 1);
                    }
                } else {
                    await instance
                        .connect(signer)
                        .submitSolution(1, ethers.toUtf8Bytes("abcd"));
                }
                scoreCount.set(
                    signer.address,

                    {
                        score: scoreCount.get(signer.address),
                        elo: Number(await instance.userRatings(signer.address)),
                    },
                );
            }
        }

        beforeEach(async function () {
            await instance
                .connect(creator1)
                .addPuzzle(sampleProblem1, solution1, board1, []);
            await instance
                .connect(creator1)
                .addPuzzle(sampleProblem2, solution2, move2, []);
            await simulateSolving();
        });

        it("Able to construct points leaderboard", async function () {
            const puzzle1 = await instance.puzzlesById(0);
            const puzzle2 = await instance.puzzlesById(1);

            // Ensure score sorting is equal to puzzle sorting
            const arraysSortedFromScore = Array.from(scoreCount.keys()).sort(
                (a, b) => {
                    const scoreDiff =
                        scoreCount.get(a).score - scoreCount.get(b).score;
                    if (scoreDiff > 0) {
                        return scoreDiff;
                    } else {
                        return scoreCount.get(a).elo - scoreCount.get(b).elo;
                    }
                },
            );
            const arraysSortedFromElo = Array.from(scoreCount.keys()).sort(
                (a, b) => {
                    return scoreCount.get(a).elo - scoreCount.get(b).elo;
                },
            );
            expect(arraysSortedFromScore).to.deep.equal(arraysSortedFromElo);
            // expect(puzzle1.solveCount).to.be.equal(solves1);
            // expect(puzzle2.solveCount).to.be.equal(solves2);

            // expect(puzzle1.attemptCount).to.be.equal(players);
            // expect(puzzle2.attemptCount).to.be.equal(players);
        });
    });

    */
});

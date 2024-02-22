import { ethers, deployments } from "hardhat";
import { SimpleChessToken } from "../typechain-types";
import { expect } from "chai";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

let instance: SimpleChessToken;
let deployer: HardhatEthersSigner;
let user1: HardhatEthersSigner;

describe("Validate ELO ratings", () => {
    beforeEach(async () => {
        await deployments.fixture(["Deploy"]);
        const simpleChessToken = await deployments.get("SimpleChessToken");
        instance = (await ethers.getContractAt(
            "SimpleChessToken",
            simpleChessToken.address,
        )) as SimpleChessToken;
        [deployer, user1] = await ethers.getSigners();
    });

    it("updates elo correctly for solved puzzle", async () => {
        await instance.setUserRating(user1, 1477);
        await instance.setPuzzleRating(0, 1609);
        await instance.updateElo(user1, 0, true);
        expect(await instance.userRatings(user1)).to.be.greaterThan(1477);
        expect(await instance.puzzleRatings(0)).to.be.lessThan(1609);
    });

    it("updates elo correctly for failed puzzle", async () => {
        await instance.setUserRating(user1, 1477);
        await instance.setPuzzleRating(0, 1609);
        await instance.updateElo(user1, 0, false);
        expect(await instance.userRatings(user1)).to.be.lessThan(1477);
        expect(await instance.puzzleRatings(0)).to.be.greaterThan(1609);
    });
});

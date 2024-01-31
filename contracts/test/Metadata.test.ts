import { ethers } from "hardhat";

import { SimpleChessToken } from "../typechain-types";
import { FENToBoard } from "../utils/boardEncoder";
import { writeFileSync } from "fs";
import puzzleSet from "../data/puzzleSet_2024-01-24.json";

let simpleChessToken: SimpleChessToken;

const tokenURIToHtml = (tokenURI: string): string => {
    const base64Token = tokenURI.split(",")[1];
    const decodedBase64Token = atob(base64Token);
    const decodedJSON = JSON.parse(decodedBase64Token);
    const encodedAnimation = decodedJSON.animation_url.split(",")[1];
    return `<body style="margin: 0px">
	<div> ${atob(encodedAnimation)} </div>
	</body>
	`;
};

const parseAndSaveTokenUri = (tokenUri: string, outName: string) => {
    const htmlContent = tokenURIToHtml(tokenUri);
    writeFileSync(`./${outName}`, htmlContent);
    return;
};

const parseAndSaveDescription = (tokenUri: string, outName: string) => {
    const base64Token = tokenUri.split(",")[1];
    const decodedBase64Token = atob(base64Token);
    const decodedJSON = JSON.parse(decodedBase64Token);
    const description = decodedJSON.description;
    writeFileSync(`./${outName}`, description);
    return;
};

describe.skip("Generate metadata for threeoutofnineART", () => {
    beforeEach(async () => {
        simpleChessToken = await ethers.deployContract("SimpleChessToken", [
            "Test",
            "TST",
        ]);
    });

    it("converts from FEN puzzle and solution to board nft art", async () => {
        const sampleProblem1 =
            "r2qkb1r/pp2nppp/3p4/2pNN1B1/2BnP3/3P4/PPP2PPP/R2bK2R w KQkq - 1 1";

        const move = FENToBoard(sampleProblem1);
        await simpleChessToken.mint(move, await ethers.provider.getSigner());
        const uri1 = await simpleChessToken.tokenURI(0);
        const base64Token = uri1.split(",")[1];
        const decodedBase64Token = atob(base64Token);
        const decodedJSON = JSON.parse(decodedBase64Token);
        console.log(decodedJSON.description);
        parseAndSaveTokenUri(uri1, "out-1.html");
    });

    it("FEN puzzle and solution to board nft art II ", async () => {
        const sampleProblem2 =
            "1rb4r/pkPp3p/1b1P3n/1Q6/N3Pp2/8/P1P3PP/7K w - - 1 1";
        const move = FENToBoard(sampleProblem2);
        await simpleChessToken.mint(move, await ethers.provider.getSigner());
        await simpleChessToken.mint(move, await ethers.provider.getSigner());
        const uri1 = await simpleChessToken.tokenURI(1);
        parseAndSaveTokenUri(uri1, "out-2.html");
    });

    it("Stress testing metadata art", async () => {
        let count = 0;
        for (let puzzle of puzzleSet) {
            const problem = puzzle[0];
            const board = FENToBoard(problem);
            await simpleChessToken.mint(
                board,
                await ethers.provider.getSigner(),
            );
            const uri = await simpleChessToken.tokenURI(count);
            parseAndSaveTokenUri(uri, `artifacts/art/puzzle-${count}.html`);
            parseAndSaveDescription(uri, `artifacts/art/puzzle-${count}.json`);
            console.log(`Processed ${count + 1} out of ${puzzleSet.length}`);
            count++;
        }
    });
});

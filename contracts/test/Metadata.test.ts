import { ethers, deployments } from "hardhat";

import { SimpleChessToken } from "../typechain-types";
import { FENToBoard } from "../utils/boardEncoder";
import { writeFileSync } from "fs";
import puzzleSet from "../data/puzzleSet_2024-01-24.json";

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
    let instance: SimpleChessToken;

    beforeEach(async () => {
        await deployments.fixture(["Deploy"]);
        const simpleChessToken = await deployments.get("SimpleChessToken");
        instance = (await ethers.getContractAt(
            "SimpleChessToken",
            simpleChessToken.address,
        )) as SimpleChessToken;
    });

    it("converts from FEN puzzle and solution to board nft art", async () => {
        const sampleProblem1 =
            "r2qkb1r/pp2nppp/3p4/2pNN1B1/2BnP3/3P4/PPP2PPP/R2bK2R w KQkq - 1 1";

        const move = FENToBoard(sampleProblem1);
        await instance.mint(move, await ethers.provider.getSigner());
        const uri1 = await instance.tokenURI(0);
        // const base64Token = uri1.split(",")[1];
        // const decodedBase64Token = atob(base64Token);
        // const decodedJSON = JSON.parse(decodedBase64Token);
        // console.log(decodedJSON.description);
        parseAndSaveTokenUri(uri1, "out-1.html");
    });

    it("FEN puzzle and solution to board nft art II ", async () => {
        const sampleProblem2 =
            "1rb4r/pkPp3p/1b1P3n/1Q6/N3Pp2/8/P1P3PP/7K w - - 1 1";
        const move = FENToBoard(sampleProblem2);
        await instance.mint(move, await ethers.provider.getSigner());
        await instance.mint(move, await ethers.provider.getSigner());
        const uri1 = await instance.tokenURI(1);
        writeFileSync(`./test.text`, uri1);
        // parseAndSaveTokenUri(uri1, "out-2.html");
    });

    it.skip("Stress testing metadata art", async () => {
        let count = 0;
        for (let puzzle of puzzleSet) {
            const problem = puzzle[0];
            const board = FENToBoard(problem);
            await instance.mint(board, await ethers.provider.getSigner());
            const uri = await instance.tokenURI(count);
            parseAndSaveTokenUri(uri, `artifacts/art/puzzle-${count}.html`);
            parseAndSaveDescription(uri, `artifacts/art/puzzle-${count}.json`);
            console.log(`Processed ${count + 1} out of ${puzzleSet.length}`);
            count++;
        }
    });
});

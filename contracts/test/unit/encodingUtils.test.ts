import {
    FENToBoard,
    FENtoFiveOutOfNineIndex,
    indexToBytes,
} from "../../utils/boardEncoder";
import { expect } from "chai";

describe("Correct FEN to board conversion", () => {
    it("correct for initial state 6x6 board", () => {
        const boardState =
            "8/1rbqkbr1/1pppppp1/8/8/1PPPPPP1/1RNQKNR1/8 w KQkq - 0 1";
        expect(FENToBoard(boardState)).to.equal(
            331315573416267984596543414422294546879883252852981354553476644864n,
        );
    });

    it("FEN to 5/9 index converted correctly", () => {
        expect(FENtoFiveOutOfNineIndex("a1")).to.equal(7);
        expect(FENtoFiveOutOfNineIndex("h1")).to.equal(0);
        expect(FENtoFiveOutOfNineIndex("a8")).to.equal(63);
        expect(FENtoFiveOutOfNineIndex("h8")).to.equal(56);
    });

    it("should encode a chess move from algebraic to bitpacked", function () {
        const lastPlayedMove = "c3c4"; // c3 to c4 ; 21- 29
        expect(indexToBytes(lastPlayedMove)).to.equal(1373);

        const lastPlayedMoveI = "e3e4";
        expect(indexToBytes(lastPlayedMoveI)).to.equal(1243);
    });
});

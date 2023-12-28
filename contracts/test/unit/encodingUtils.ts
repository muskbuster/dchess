import { FENToBoard } from "../../utils/fiveOutOfNineArt"
import { expect } from "chai"

describe("Correct FEN to board conversion", () => {
	it("correct for initial state 6x6 board", () => {
		const boardState = "8/1rbqkbr1/1pppppp1/8/8/1PPPPPP1/1RNQKNR1/8"
		expect(FENToBoard(boardState, true)).to.equal(
			331315573416267984596543414422294546879883252852981354553476644865n
		)
	})
})

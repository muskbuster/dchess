import { Chess, Square } from "chess.js"
// maps characters in FEN to bytes represented in fiveoutofnine chess lib
export const CHESS_TO_BYTE: Record<string, number> = {
	e: 0b0,
	p: 0b001,
	r: 0b011,
	n: 0b100,
	q: 0b101,
	b: 0b010,
	k: 0b110,
	P: 0b1001,
	R: 0b1011,
	N: 0b1100,
	Q: 0b1101,
	K: 0b1110,
	B: 0b1010,
}

// Converts FEN string to board uint as represented in fiveoutofnine
export const FENToBoard = (FEN: string) => {
	const initialBoard = new Chess(FEN)
	const chessBoard = reduceChessBoard(initialBoard)

	// Calculate metadata ; assume depth is 4
	const metadata = 4 << 24

	// calculate board
	const [boardFEN, , ,] = chessBoard.fen().split(" ")
	const cleanedFEN = boardFEN.split("/").join("")

	// convert from FEN to the encoded uint
	const x = []
	for (let i = 0; i < cleanedFEN.length; i++) {
		const c = cleanedFEN[i]
		if (!isNaN(Number(c))) {
			const emptyCells = Number(c)
			for (let j = 0; j < emptyCells; j++) {
				x.push(0b0)
			}
		} else {
			x.push(CHESS_TO_BYTE[c])
		}
	}

	const board = BigInt("0x" + x.map((x) => x.toString(16)).join(""))

	return { board, metadata }
}

// convert board index ( as in the board.sol documentation ) to packed bytes as metadata
export const indexToBytes = (index: string) => {
	// e.g. c3c4 -> 13-73 -> 1373 (i.e. 13 << 6 | 73)
	const from = FENtoFiveOutOfNineIndex(index.substring(0, 2)) << 6
	const to = FENtoFiveOutOfNineIndex(index.substring(2, 4))
	return from | to
}

export const FENtoFiveOutOfNineIndex = (FENIndex: string): number => {
	const col = 8 - (FENIndex[0].charCodeAt(0) - 96)
	const row = parseInt(FENIndex[1]) - 1
	return col + row * 8
}

// Remove all pieces on the edges of the board to get to 6x6
const reduceChessBoard = (board: Chess): Chess => {
	for (let i = 1; i < 9; i++) {
		board.remove(("a" + i.toString()) as Square)
		board.remove(("h" + i.toString()) as Square)
		board.remove((String.fromCharCode(96 + i) + "1") as Square)
		board.remove((String.fromCharCode(96 + i) + "8") as Square)
	}
	return board
}

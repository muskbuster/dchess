export const CHESS_PIECE_TO_BYTE: Record<string, number> = {
	p: 0b0001, //       Each chess piece is defined with 4 bits as follows:
	r: 0b0011, //           * The first bit denotes the color (0 means black; 1 means white).
	n: 0b0100, //           * The last 3 bits denote the type:
	q: 0b0101, //               | Bits | # | Type   |
	b: 0b0010, //               | ---- | - | ------ |
	k: 0b0110, //               | 000  | 0 | Empty  |
	P: 0b1001, //               | 001  | 1 | Pawn   |
	R: 0b1011, //               | 010  | 2 | Bishop |
	N: 0b1100, //               | 011  | 3 | Rook   |
	Q: 0b1101, //               | 100  | 4 | Knight |
	K: 0b1110, //               | 101  | 5 | Queen  |
	B: 0b1010, //               | 110  | 6 | King   |
}

// Converts FEN string to board uint as represented in fiveoutofnine
export const FENToBoard = (FEN: string) => {
	const [boardFEN, , ,] = FEN.split(" ")
	const cleanedFEN = boardFEN.split("/").join("")

	// convert from FEN to the encoded uint
	const x = []
	for (let i = 0; i < cleanedFEN.length; i++) {
		const square = cleanedFEN[i]
		if (isNaN(Number(square))) {
			x.push(CHESS_PIECE_TO_BYTE[square])
		} else {
			const noOfEmptyCells = Number(square)
			for (let j = 0; j < noOfEmptyCells; j++) {
				x.push(0b0000)
			}
		}
	}

	const board = BigInt("0x" + x.map((x) => x.toString(16)).join("")) // convert to hexadecimal to decimal

	return board
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

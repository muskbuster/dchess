// maps characters in FEN to bytes represented in fiveoutofnine chess lib
export const CHESS_TO_BYTE: Record<string, interger> = {
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
export const FENToBoard = (FEN: string, whiteToMove: boolean) => {
	const cleanedFEN = FEN.split("/").join("")
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

	if (whiteToMove) {
		x[x.length - 1] = 1n
	}

	return BigInt("0x" + x.map((x) => x.toString(16)).join(""))
}

import { FENToBoard } from "../utils/parser"

const sampleProblem1 =
	"r2qkb1r/pp2nppp/3p4/2pNN1B1/2BnP3/3P4/PPP2PPP/R2bK2R w KQkq - 1 1"

const move = FENToBoard(sampleProblem1)

console.log(move)

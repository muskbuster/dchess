import { createSchema } from "@ponder/core";

export default createSchema((p) => ({
  User: p.createTable({
    id: p.string(), // Address
    // address: p.string(),
    rating: p.bigint(),
    totalSolved: p.bigint(),
    totalAttempted: p.bigint(),
    totalCreated: p.bigint(),
    // puzzlesSolved: p.many("Puzzle.solvers"),
  }),

  Puzzle: p.createTable({
    id: p.int(),
    fen: p.string(),
    board: p.bigint(),
    boardMetaData: p.bigint(),
    rating: p.bigint(),
    totalAttempts: p.bigint(),
    totalSolves: p.bigint(),
    creator: p.string(),
  }),

  NFT: p.createTable({
    id: p.bigint(),
    puzzleId: p.int(),
    uri: p.string(),
  }),
}));

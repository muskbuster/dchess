import { createSchema } from "@ponder/core";

export default createSchema((p) => ({
  User: p.createTable({
    id: p.string(), // Address
    rating: p.bigint(),
    totalSolved: p.bigint(),
    totalAttempted: p.bigint(),
    totalCreated: p.bigint(),
    userPuzzles: p.many("UserPuzzle.userId"), // Puzzles solved by users
    nftsOwned: p.many("NFT.userId"),
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
    uesrPuzzles: p.many("UserPuzzle.puzzleId"), // Puzzles solved by users
    uri: p.string(),
  }),

  UserPuzzle: p.createTable({
    id: p.string(),
    userId: p.string().references("User.id"),
    puzzleId: p.int().references("Puzzle.id"),
    person: p.one("userId"),
    puzzle: p.one("puzzleId"),
    metadata: p.string(),
  }),

  NFT: p.createTable({
    id: p.bigint(),
    puzzleId: p.int(),
    uri: p.string(),
    userId: p.string().references("User.id"),
    user: p.one("userId"),
  }),
}));

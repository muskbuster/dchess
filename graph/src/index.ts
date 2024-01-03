import { ponder } from "@/generated";
import { DEFAULT_RATING } from "./constants";
import { BoardAbi } from "../abis/Board";

// const createNewPuzzle = async({Puzzle}) => {
//   await

// }

ponder.on("Board:PuzzleAdded", async ({ event, context }) => {
  const { Puzzle, User } = context.db;
  console.log("CREATING PUZZLE", event.args);

  const creator = await User.findUnique({ id: event.args.creator });
  if (!creator) {
    await User.create({
      id: event.args.creator,
      data: {
        totalSolved: 0n,
        totalAttempted: 0n,
        totalCreated: 1n,
        rating: DEFAULT_RATING,
      },
    });
  }

  await Puzzle.create({
    id: event.args.puzzleId,
    data: {
      fen: event.args.fen,
      totalAttempts: 0n,
      totalSolves: 0n,
      rating: DEFAULT_RATING,
      boardMetaData: event.args.metadata,
      board: event.args.board,
      creator: event.args.creator,
    },
  });
});

ponder.on("Board:PuzzleSolved", async ({ event, context }) => {
  console.log("PUZZLE SOLVED", event.args);
  const { User, Puzzle } = context.db;

  const userToUpdate = await User.findUnique({ id: event.args.user });

  if (!userToUpdate) {
    await User.create({
      id: event.args.user,
      data: {
        totalSolved: 0n,
        totalAttempted: 0n,
        totalCreated: 0n,
        rating: DEFAULT_RATING,
      },
    });
  }

  if (userToUpdate) {
    // Update user and puzzle information when a puzzle is solved
    await User.update({
      id: event.args.user,
      data: {
        totalSolved: userToUpdate.totalSolved + 1n,
      },
    });
  }

  const puzzleToUpdate = await Puzzle.findUnique({ id: event.args.puzzleId });
  if (puzzleToUpdate) {
    await Puzzle.update({
      id: event.args.puzzleId,
      data: {
        totalSolves: puzzleToUpdate.totalSolves + 1n,
      },
    });
  }
});

ponder.on("Board:PuzzleAttempted", async ({ event, context }) => {
  console.log("PUZZLE Attempted ", event.args);
  const { User, Puzzle } = context.db;

  let userToUpdate = await User.findUnique({ id: event.args.user });
  const puzzleToUpdate = await Puzzle.findUnique({ id: event.args.puzzleId });

  if (!userToUpdate) {
    userToUpdate = await User.create({
      id: event.args.user,
      data: {
        totalSolved: 0n,
        totalAttempted: 0n,
        totalCreated: 0n,
        rating: DEFAULT_RATING,
      },
    });
  }

  // Update user and puzzle information when a puzzle is attempted
  await User.update({
    id: event.args.user,
    data: {
      totalAttempted: userToUpdate.totalAttempted + 1n,
    },
  });

  if (puzzleToUpdate) {
    await Puzzle.update({
      id: event.args.puzzleId,
      data: {
        totalAttempts: puzzleToUpdate.totalAttempts + 1n,
      },
    });
  }
});

ponder.on("Board:UserRatingChanged", async ({ event, context }) => {
  console.log("user rating changed", event.args);
  const { User } = context.db;
  // Update user's rating when it changes
  await User.update({
    id: event.args.user,
    data: {
      rating: event.args.newUserRating,
    },
  });
});

ponder.on("Board:PuzzleRatingChanged", async ({ event, context }) => {
  console.log("puzzle rating changed", event.args);
  const { Puzzle } = context.db;

  // Update puzzle's rating when it changes
  await Puzzle.update({
    id: event.args.puzzleId,
    data: {
      rating: event.args.newPuzzleRating,
    },
  });
});

ponder.on("Board:TokenMinted", async ({ event, context }) => {
  const { NFT } = context.db;
  const { Board } = context.contracts;

  const uri = await context.client.readContract({
    abi: BoardAbi,
    address: Board.address,
    functionName: "uri",
    args: [event.args.tokenId],
  });

  // Create an NFT record when a token is minted
  await NFT.create({
    id: event.args.tokenId,
    data: {
      puzzleId: event.args.puzzleId,
      uri,
    },
  });
});

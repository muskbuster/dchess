import prisma from "../lib/prisma.js";

export const findStatsByUsername = async (username: string) => {
  const user = await prisma.user.findFirst({ where: { farcaster: username } });
  if (!user) {
    return {
      points: 0,
    };
  }

  const ratings = await getRatings(user.address);
  const attempts = await attemptCount(user.address);
  const solves = await solveCount(user.address);

  return {
    points: user.points.toString(),
    ratings: ratings.toString(),
    attempts: attempts.toString(),
    solves: solves.toString(),
  };
};

async function getRatings(address: string) {
  const adjustedAddress = address.slice(2).toLowerCase();
  const ratings =
    await prisma.base_user_rating_changed_user_rating_changed.findFirst({
      where: {
        user: Buffer.from(adjustedAddress, "hex"),
      },
      orderBy: [
        {
          block_timestamp: "desc",
        },
      ],
    });
  return ratings ? ratings.new_user_rating : 1000;
}

async function attemptCount(address: string): Promise<number> {
  const adjustedAddress = address.slice(2).toLowerCase();
  const count = await prisma.base_puzzle_attempted_puzzle_attempted.count({
    where: {
      user: Buffer.from(adjustedAddress, "hex"),
    },
  });
  return count;
}

async function solveCount(address: string): Promise<number> {
  const adjustedAddress = address.slice(2).toLowerCase();
  const count = await prisma.base_puzzle_solved_puzzle_solved.count({
    where: {
      user: Buffer.from(adjustedAddress, "hex"),
    },
  });
  return count;
}

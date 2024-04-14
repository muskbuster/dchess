// param is the action and points are updated as such, maybe it should just be refresh points
// each time some action is done, points are refreshed and updated
// many queries, check last updated at time?
// more secure vs less cost
// going for more secure, cost can always be brought down later
// what do we need to check:
// per user, all attempts, solved, minted and shared
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { address: string } }
) {
  const userAddress = params.address;

  let points = 0;
  points += (await attemptCount(userAddress)) * 25;
  points += (await solveCount(userAddress)) * 50;
  points += (await mintCount(userAddress)) * 250;
  points += postCount(userAddress) * 500;

  const result = {
    points,
  };
  return NextResponse.json(result, { status: 200 });
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

async function mintCount(address: string): Promise<number> {
  const adjustedAddress = address.slice(2).toLowerCase();
  const count = await prisma.base_token_minted_token_minted.count({
    where: {
      solver: Buffer.from(adjustedAddress, "hex"),
    },
  });
  return count;
}

function postCount(address: string): number {
  return 0;
}

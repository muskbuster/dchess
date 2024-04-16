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

  // persist points
  await prisma.user.upsert({
    where: { address: userAddress },
    update: {
      points: points,
    },
    create: {
      address: userAddress,
      points: points,
    },
  });

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

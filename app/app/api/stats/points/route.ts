import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const players = await getTopPlayers();

    const stats = {
      players,
    };
    return NextResponse.json(stats, { status: 200 });
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { message: "Unable to find user stats" },
      { status: 500 }
    );
  }
}

async function getTopPlayers() {
  const allUsers = await prisma.user.findMany({
    orderBy: [
      {
        points: "desc",
      },
    ],
  });
  return allUsers.map((u) => {
    return {
      address: u.address,
      ens: u.ens,
      farcaster: u.farcaster,
      points: u.points,
    };
  });
}

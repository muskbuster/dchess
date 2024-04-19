import { NextRequest, NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import { unstable_noStore as noStore } from "next/cache";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  // https://github.com/orgs/vercel/discussions/4696
  noStore();
  try {
    const response = await getTopPlayers();
    const players = await Promise.all(
      response.map(async (p: any) => {
        const socials = await getSocials(p.address);
        return {
          address: socials != null ? socials.address : p.address,
          ens: socials?.ens,
          farcaster: socials?.farcaster,
          rating: p.rating,
        };
      })
    );

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
  const { rows } = await sql`WITH all_ratings AS (
    SELECT
        encode(CAST(ratings.user AS bytea), 'hex') AS user,
        new_user_rating AS ratings,
        block_number
    FROM
        base_user_rating_changed_user_rating_changed AS ratings
)
SELECT
    all_ratings.user,
    all_ratings.ratings
FROM
    all_ratings
    INNER JOIN (
        SELECT
            all_ratings.user,
            MAX(block_number) AS latest_block_number
        FROM
            all_ratings
        GROUP BY
            all_ratings.user) AS latest ON latest.user = all_ratings.user
WHERE
    latest.latest_block_number = all_ratings.block_number
ORDER BY
    all_ratings.ratings DESC`;

  return rows.map((r) => {
    return {
      address: "0x" + r.user,
      rating: r.ratings,
    };
  });
}

async function getSocials(userAddress: string) {
  return await prisma.user.findFirst({
    where: {
      address: {
        contains: userAddress,
        mode: "insensitive",
      },
    },
  });
}

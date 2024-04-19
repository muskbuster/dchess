import { NextRequest, NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import { unstable_noStore as noStore } from "next/cache";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  // https://github.com/orgs/vercel/discussions/4696
  noStore();
  try {
    const response = await getTopCreators();
    const players = await Promise.all(
      response.map(async (p: any) => {
        const socials = await getSocials(p.address);
        return {
          address: socials != null ? socials.address : p.address,
          ens: socials?.ens,
          farcaster: socials?.farcaster,
          mint_count: p.mint_count,
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

async function getTopCreators() {
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
    all_ratings.ratings,
    creators.count,
    total_minted.count AS minted_count
FROM
    all_ratings
    INNER JOIN (
        SELECT
            encode(CAST(puzzles.creator AS bytea), 'hex') AS creator,
            count(*)
        FROM
            base_puzzle_added_puzzle_added AS puzzles
        GROUP BY
            puzzles.creator
    ) AS creators ON creators.creator = all_ratings.user
    INNER JOIN (
        SELECT
            all_ratings.user,
            MAX(block_number) AS latest_block_number
        FROM
            all_ratings
        GROUP BY
            all_ratings.user
    ) AS latest ON latest.user = all_ratings.user
    INNER JOIN (
        SELECT
            creators.user,
            count(*)
        FROM
            base_token_minted_token_minted AS minted
            INNER JOIN (
                SELECT
                    encode(CAST(added.creator AS bytea), 'hex') AS user,
                    internal_token_id
                FROM
                    base_puzzle_added_puzzle_added AS added
            ) AS creators ON creators.internal_token_id = minted.internal_token_id
        GROUP BY
            creators.user
    ) AS total_minted ON total_minted.user = all_ratings.user
WHERE
    latest.latest_block_number = all_ratings.block_number
ORDER BY
    minted_count DESC`;

  return rows.map((r) => {
    return {
      address: "0x" + r.user,
      ratings: r.ratings,
      created: r.count,
      mint_count: r.minted_count,
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

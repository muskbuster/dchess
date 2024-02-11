import { NextRequest, NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import { unstable_noStore as noStore } from "next/cache";

export async function GET(request: NextRequest) {
  // https://github.com/orgs/vercel/discussions/4696
  noStore();
  try {
    const players = await getTopPlayers();
    const creators = await getTopCreators();

    const stats = {
      players,
      creators,
    };
    return NextResponse.json(JSON.stringify(stats), { status: 200 });
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
        base_sepolia_user_rating_changed_user_rating_changed AS ratings
)
SELECT
    all_ratings.user,
    all_ratings.ratings,
    solved.solved_count,
    minted.count AS minted_count
FROM
    all_ratings
    INNER JOIN (
        SELECT
            encode(CAST(solved.user AS bytea), 'hex') AS user,
            count(*) AS solved_count
        FROM
            base_sepolia_puzzle_solved_puzzle_solved AS solved
        GROUP BY
            solved.user) AS solved ON solved.user = all_ratings.user
    INNER JOIN (
        SELECT
            encode(CAST(minted.solver AS bytea), 'hex') AS user, count(*)
        FROM
            base_sepolia_token_minted_token_minted AS minted
        GROUP BY
            minted.solver) AS minted ON minted.user = all_ratings.user
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
      user: "0x" + r.user,
      ratings: r.ratings,
      solves: r.solved_count,
      minted: r.minted_count,
    };
  });
}

async function getTopCreators() {
  const { rows } = await sql`WITH all_ratings AS (
    SELECT
        encode(CAST(ratings.user AS bytea), 'hex') AS user,
        new_user_rating AS ratings,
        block_number
    FROM
        base_sepolia_user_rating_changed_user_rating_changed AS ratings
)

SELECT
    all_ratings.user,
    all_ratings.ratings,
    creators.count
FROM
    all_ratings
    INNER JOIN (
        SELECT
            encode(CAST(puzzles.creator AS bytea), 'hex') AS creator,
            count(*)
        FROM
            base_sepolia_puzzle_added_puzzle_added AS puzzles
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
WHERE
    latest.latest_block_number = all_ratings.block_number
ORDER BY
    creators.count DESC`;

  return rows.map((r) => {
    return {
      user: "0x" + r.user,
      ratings: r.ratings,
      created: r.count,
    };
  });
}

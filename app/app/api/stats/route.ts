import { NextRequest, NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

export async function GET(
  request: NextRequest
  //   { params }: { params: { address: string } }
) {
  // await refreshBalance(params.address);

  try {
    const { rows, fields } = await sql`WITH all_ratings AS (
      SELECT
          encode(CAST(ratings.user AS bytea), 'hex') AS user,
          new_user_rating AS ratings,
          block_number
      FROM
          base_sepolia_user_rating_changed_user_rating_changed AS ratings
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

    const stats = rows.map((r) => {
      return {
        user: "0x" + r.user,
        ratings: r.ratings,
      };
    });
    return NextResponse.json(JSON.stringify(stats), { status: 200 });
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { message: "Unable to find user stats" },
      { status: 500 }
    );
  }
}

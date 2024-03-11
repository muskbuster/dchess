import { NextRequest, NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import { unstable_noStore as noStore } from "next/cache";

export async function GET(
  request: NextRequest,
  { params }: { params: { address: string } }
) {
  // https://github.com/orgs/vercel/discussions/4696
  noStore();
  const userAddress = params.address;

  try {
    const puzzles = await getPuzzles(userAddress.slice(2));
    return NextResponse.json(JSON.stringify(puzzles), { status: 200 });
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { message: "Unable to find puzzles" },
      { status: 500 }
    );
  }
}

async function getPuzzles(userAddress: string) {
  const { rows } = await sql`WITH stats as (
    SELECT 
      tbl.puzzle_id, 
      tbl.attempted, 
      count(*) as solved 
    FROM 
      (
        SELECT 
          added.internal_token_id as puzzle_id, 
          count(*) as attempted 
        FROM 
          base_puzzle_added_puzzle_added added FULL 
          JOIN base_puzzle_attempted_puzzle_attempted attempted ON attempted.internal_token_id = added.internal_token_id 
        GROUP BY 
          added.internal_token_id
      ) AS tbl FULL 
      JOIN base_puzzle_solved_puzzle_solved solved ON solved.internal_token_id = tbl.puzzle_id 
    GROUP BY 
      tbl.puzzle_id, 
      tbl.attempted
  ), 
  solvers AS (
    SELECT 
      encode(
        CAST(solved.user AS bytea), 
        'hex'
      ) AS user, 
      internal_token_id 
    FROM 
      base_puzzle_solved_puzzle_solved AS solved
  ), 
  attempters AS (
    SELECT 
      encode(
        CAST(attempted.user AS bytea), 
        'hex'
      ) AS user, 
      internal_token_id 
    FROM 
      base_puzzle_attempted_puzzle_attempted AS attempted
  ),
  minters AS (SELECT 
    internal_token_id, 
    encode(
      CAST(minted.solver AS bytea), 
      'hex'
    ) AS user 
  FROM 
    base_token_minted_token_minted AS minted)
  
  SELECT 
    *, 
    CASE WHEN EXISTS (
      SELECT 
        * 
      FROM 
        solvers 
      WHERE 
        solvers.user = ${userAddress.toLowerCase()}  
        AND solvers.internal_token_id = stats.puzzle_id
    ) THEN 'TRUE' ELSE 'FALSE' END AS user_solved, 
    CASE WHEN EXISTS (
      SELECT 
        * 
      FROM 
        attempters 
      WHERE 
        attempters.user = ${userAddress.toLowerCase()}  
        AND attempters.internal_token_id = stats.puzzle_id
    ) THEN 'TRUE' ELSE 'FALSE' END AS user_attempted,
  CASE WHEN EXISTS (
      SELECT 
        * 
      FROM 
        minters 
      WHERE 
        minters.user = ${userAddress.toLowerCase()} 
        AND minters.internal_token_id = stats.puzzle_id
    ) THEN 'TRUE' ELSE 'FALSE' END AS user_minted 
  FROM 
    stats 
  ORDER BY 
    stats.puzzle_id`;

  return rows.map((r) => {
    return {
      puzzle_id: r.puzzle_id,
      attempted: r.attempted,
      solved: r.solved,
      user_solved: r.user_solved,
      user_attempted: r.user_attempted,
      user_minted: r.user_minted,
    };
  });
}

import { NextRequest, NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

export async function GET(
  request: NextRequest,
  { params }: { params: { address: string } }
) {
  const userAddress = params.address;

  try {
    const info = await getPlayerInfo(userAddress.slice(2));
    const nftsOwned = await getNftsOwned(userAddress.slice(2));

    const profile = {
      totalSolved: info[0].solves,
      totalAttempted: info[0].attempts,
      ratings: info[0].ratings,
      nftsOwned,
    };
    return NextResponse.json(JSON.stringify(profile), { status: 200 });
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { message: "Unable to find user stats" },
      { status: 500 }
    );
  }
}

async function getPlayerInfo(userAddress: string) {
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
    attempted.attempted_count
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
            encode(CAST(attempted.user AS bytea), 'hex') AS user,
            count(*) AS attempted_count
        FROM
            base_sepolia_puzzle_attempted_puzzle_attempted AS attempted
        GROUP BY
            attempted.user) AS attempted ON attempted.user = all_ratings.user
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
    AND all_ratings.user = ${userAddress.toLowerCase()}`;

  return rows.map((r) => {
    return {
      ratings: r.ratings,
      solves: r.solved_count,
      attempts: r.attempted_count,
    };
  });
}

async function getNftsOwned(userAddress: string) {
  const recieved: { token_id: number; value: number }[] = await nftsRecieved(
    userAddress
  );
  const sent: { token_id: number; value: number }[] = await nftsSent(
    userAddress
  );

  const aggregateReceived = recieved.reduce(
    (acc: { token_id: number; value: number }[], curr) => {
      const idx = acc.findIndex(
        (e: { token_id: number; value: number }) => e.token_id == curr.token_id
      );
      if (idx == -1) {
        return acc.concat([curr]);
      } else {
        acc[idx].value += curr.value;
        return acc;
      }
    },
    []
  );

  const aggregate = sent.reduce(
    (acc: { token_id: number; value: number }[], curr) => {
      const idx = acc.findIndex(
        (e: { token_id: number; value: number }) => e.token_id == curr.token_id
      );
      if (idx == -1) {
        // should never get here
        return acc;
      } else {
        acc[idx].value -= curr.value;
        return acc;
      }
    },
    aggregateReceived
  );

  return aggregate;
}

async function nftsRecieved(userAddress: string) {
  const { rows } = await sql`WITH transfers AS (
    SELECT
        encode(CAST(transfers.from AS bytea), 'hex') AS
    FROM
,
        encode(CAST(transfers.to AS bytea), 'hex') AS to,
        transfers.d_chess_id AS token_id,
        transfers.value
    FROM
        base_sepolia_transfer_single_transfer_single AS transfers
)
SELECT
    *
FROM
    transfers
WHERE
    transfers.to = ${userAddress.toLowerCase()}`;

  return rows.map((r) => {
    return {
      token_id: r.token_id,
      value: r.value,
    };
  });
}

async function nftsSent(userAddress: string) {
  const { rows } = await sql`WITH transfers AS (
      SELECT
          encode(CAST(transfers.from AS bytea), 'hex') AS
      FROM
  ,
          encode(CAST(transfers.to AS bytea), 'hex') AS to,
          transfers.d_chess_id AS token_id,
          transfers.value
      FROM
          base_sepolia_transfer_single_transfer_single AS transfers
  )
  SELECT
      *
  FROM
      transfers
  WHERE
      transfers.from = ${userAddress.toLowerCase()}`;

  return rows.map((r) => {
    return {
      token_id: r.token_id,
      value: r.value,
    };
  });
}

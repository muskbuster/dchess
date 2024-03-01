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
    const owned = await getOwnedTokenCount(userAddress.slice(2));

    const response = {
      total: owned,
    };
    return NextResponse.json(JSON.stringify(response), { status: 200 });
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { message: "Unable to find user stats" },
      { status: 500 }
    );
  }
}

async function getOwnedTokenCount(userAddress: string) {
  const totalRecieved = await nftsRecieved(userAddress);
  const totalSent = await nftsSent(userAddress);

  return totalRecieved - totalSent;
}

async function nftsRecieved(userAddress: string): Promise<number> {
  const { rows } = await sql`WITH transfers AS (
    SELECT
        encode(CAST(transfers.from AS bytea), 'hex') AS from,
        encode(CAST(transfers.to AS bytea), 'hex') AS to,
        transfers.d_chess_id AS token_id,
        transfers.value
    FROM
        base_transfer_single_transfer_single AS transfers
)
SELECT
    sum(value)
FROM
    transfers
WHERE
    transfers.to = ${userAddress.toLowerCase()}`;

  return rows.length > 0 && rows[0].sum ? Number(rows[0].sum) : 0;
}

async function nftsSent(userAddress: string): Promise<number> {
  const { rows } = await sql`WITH transfers AS (
      SELECT
          encode(CAST(transfers.from AS bytea), 'hex') AS
      FROM
  ,
          encode(CAST(transfers.to AS bytea), 'hex') AS to,
          transfers.d_chess_id AS token_id,
          transfers.value
      FROM
          base_transfer_single_transfer_single AS transfers
  )
  SELECT
      sum(value)
  FROM
      transfers
  WHERE
      transfers.from = ${userAddress.toLowerCase()}`;

  return rows.length > 0 && rows[0].sum ? Number(rows[0].sum) : 0;
}

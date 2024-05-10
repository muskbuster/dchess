// run script: ts-node scripts/neynar.ts

import { NeynarAPIClient, CastParamType } from "@neynar/nodejs-sdk";
import "dotenv/config";

// make sure to set your NEYNAR_API_KEY .env
const client = new NeynarAPIClient(process.env.NEYNAR_API_KEY as string);

const cast = await client.lookUpCastByHashOrWarpcastUrl(
  "https://warpcast.com/empresstrash/0x8f8697d7",
  CastParamType.Url
);
console.log(cast.cast.frames); // logs information about the cast

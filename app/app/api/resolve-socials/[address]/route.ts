// resolve address to farcaster username and save in the database

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { init, fetchQuery } from "@airstack/node";

init(process.env.AIRSTACK_API_KEY as string);

const AIRSTACK_GET_SOCIALS = `
  query GetWeb3SocialsOfFarcasters($userAddress: Identity!) {
    Socials(
      input: {
        filter: { identity: { _in: [$userAddress] } }
        blockchain: ethereum
      }
    ) {
      Social {
        dappName
        profileName
      }
    }
  }
`;

const AIRSTACK_GET_ENS = `
  query GetENS($userAddress: Address!) {
    Domains(
      input: {
        filter: { resolvedAddress: { _in: [$userAddress] } }
        blockchain: ethereum
      }
    ) {
      Domain {
        resolvedAddress
        name
        isPrimary
      }
    }
  }
`;

export async function GET(
  request: NextRequest,
  { params }: { params: { address: string } }
) {
  const userAddress = params.address;
  let user = await prisma.user.findFirst({ where: { address: userAddress } });
  // if no user found, create one
  if (!user) {
    user = await prisma.user.create({
      data: {
        address: userAddress,
      },
    });
  }

  // if farcaster does exist fetch it
  if (user.farcaster == null) {
    const farcasterUsername = await fetchFarcaster(userAddress);
    user = await prisma.user.update({
      where: { address: userAddress },
      data: { farcaster: farcasterUsername },
    });
  }

  // if ens does exist fetch it
  if (user.ens == null) {
    const ens = await fetchENS(userAddress);
    user = await prisma.user.update({
      where: { address: userAddress },
      data: { ens: ens },
    });
  }

  const result = {
    ens: user.ens,
    farcaster: user.farcaster,
  };

  return NextResponse.json(result, { status: 200 });
}

async function fetchFarcaster(userAddress: string) {
  const { data, error } = await fetchQuery(AIRSTACK_GET_SOCIALS, {
    userAddress: userAddress,
  });
  if (error) {
    console.log(error);
    return null;
  }

  if (data && data.Socials && data.Socials.Social) {
    const farcaster_profile = data.Socials.Social.find(
      (s: any) => s.dappName == "farcaster"
    );
    if (farcaster_profile) {
      const farcaster_username = farcaster_profile.profileName;
      return farcaster_username;
    }
  }
  return null;
}

async function fetchENS(userAddress: string) {
  const { data, error } = await fetchQuery(AIRSTACK_GET_ENS, {
    userAddress: userAddress,
  });
  if (error) {
    console.log(error);
    return null;
  }

  if (data && data.Domains && data.Domains.Domain) {
    const primaryEns = data.Domains.Domain.find(
      (d: any) => d.isPrimary == true
    );
    return primaryEns.name;
  }
  return null;
}

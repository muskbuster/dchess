import React from "react";
import Link from "next/link";
import { zeroAddress } from "viem";
import { ConnectedWallet } from "@privy-io/react-auth";
import useFetchMintPrice from "@/hooks/useFetchMintPrice";
import useETHConversion from "@/hooks/useETHConversion";
import useFetchEarningsStats from "@/hooks/stats/useFetchEarningStats";
import { CanonicalUsername } from "./CanonicalUsername";

type CreatorRating = {
  address: string;
  created: number;
  ratings: number;
  minted: number;
  farcaster: string;
  ens: string;
  you: boolean;
};

const CreatorRow = ({
  creator,
  rank,
  mintPrice,
  conversion,
}: {
  creator: CreatorRating;
  rank: number;
  mintPrice: string;
  conversion: number;
}) => {
  const earned = `$ ${(creator.minted * Number(mintPrice) * conversion).toFixed(
    2
  )}`;

  return (
    <tr
      className={`border-b-1 border-slate-800 text-xs sm:text-sm ${
        creator.you ? "text-red-500" : ""
      }`}
    >
      <th className="text-[#596172]">{rank}</th>
      <td>
        <CanonicalUsername userData={creator} />
      </td>
      <td className="text-[#E6FA04] pixeloid-sans-bold">{earned}</td>
    </tr>
  );
};

export const EarningsTable = ({
  activeWallet,
}: {
  activeWallet: ConnectedWallet | undefined;
}) => {
  const { mintPrice } = useFetchMintPrice(1);
  const { ethusd } = useETHConversion();
  const { stats, isLoading } = useFetchEarningsStats(
    activeWallet ? activeWallet.address : zeroAddress
  );

  return (
    <table className="table">
      {/* head */}
      <thead className="text-[#596172] sm:text-base">
        <tr className="border-b-1 border-slate-800">
          <th className="w-[10%]">Rank</th>
          <th className="w-[70%]">Creator</th>
          <th className="w-[20%]">Earned (in USD)</th>
        </tr>
      </thead>
      <tbody>
        {stats.players.map((creator: CreatorRating, idx: number) => (
          <CreatorRow
            key={idx}
            creator={creator}
            rank={idx + 1}
            mintPrice={mintPrice}
            conversion={ethusd}
          />
        ))}
      </tbody>
    </table>
  );
};

import { zeroAddress } from "viem";
import { ConnectedWallet } from "@privy-io/react-auth";
import useFetchRatingsStats from "@/hooks/stats/useFetchRatingsStats";
import { CanonicalUsername } from "./CanonicalUsername";

type UserRating = {
  address: string;
  ens: string;
  farcaster: string;
  ratings: number;
  you: boolean;
};

const UserRow = ({
  userData,
  rank,
}: {
  userData: UserRating;
  rank: number;
}) => {
  return (
    <tr
      className={`border-b-1 border-slate-800 text-xs sm:text-sm ${
        userData.you ? "text-red-500" : ""
      }`}
    >
      <th className="text-[#596172]">{rank}</th>
      <td>
        <CanonicalUsername userData={userData} />
      </td>
      <td className="text-[#E6FA04] pixeloid-sans-bold">{userData.ratings}</td>
    </tr>
  );
};

export const RatingsTable = ({
  activeWallet,
}: {
  activeWallet: ConnectedWallet | undefined;
}) => {
  const { stats, isLoading } = useFetchRatingsStats(
    activeWallet ? activeWallet.address : zeroAddress
  );

  return (
    <table className="table">
      {/* head */}
      <thead className="text-[#596172] sm:text-base">
        <tr className="border-b-1 border-slate-800">
          <th className="w-[10%]">Rank</th>
          <th className="w-[70%]">Player</th>
          <th className="w-[20%]">Ratings</th>
        </tr>
      </thead>
      <tbody>
        {stats.players.map((user: UserRating, idx: number) => (
          <UserRow key={idx} userData={user} rank={idx + 1} />
        ))}
      </tbody>
    </table>
  );
};

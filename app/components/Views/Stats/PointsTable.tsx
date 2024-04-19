import { zeroAddress } from "viem";
import { ConnectedWallet } from "@privy-io/react-auth";
import useFetchPointsStats from "@/hooks/stats/useFetchPointsStats";
import { CanonicalUsername } from "./CanonicalUsername";

type UserPoints = {
  address: string;
  ens: string;
  farcaster: string;
  points: number;
  you: boolean;
};

const UserRow = ({
  userData,
  rank,
}: {
  userData: UserPoints;
  rank: number;
}) => {
  return (
    <tr
      className={`border-b-1 border-slate-800 text-xs sm:text-sm ${
        userData.you ? "text-red-500" : ""
      }`}
    >
      <td className="text-[#596172]">{rank}</td>
      <td>
        <CanonicalUsername userData={userData} />
      </td>
      <td className="text-[#E6FA04] pixeloid-sans-bold">{userData.points}</td>
    </tr>
  );
};

export const PointsTable = ({
  activeWallet,
}: {
  activeWallet: ConnectedWallet | undefined;
}) => {
  const { stats, isLoading } = useFetchPointsStats(
    activeWallet ? activeWallet.address : zeroAddress
  );

  return (
    <table className="table">
      {/* head */}
      <thead className="text-[#596172] sm:text-base">
        <tr className="border-b-1 border-slate-800">
          <th className="w-[10%]">Rank</th>
          <th className="w-[70%]">Player</th>
          <th className="w-[20%]">Points</th>
        </tr>
      </thead>
      <tbody>
        {stats.players.map((user: UserPoints, idx: number) => (
          <UserRow key={idx} userData={user} rank={idx + 1} />
        ))}
      </tbody>
    </table>
  );
};

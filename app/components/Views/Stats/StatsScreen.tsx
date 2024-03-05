import useETHConversion from "@/hooks/useETHConversion";
import useEnsName from "@/hooks/useEnsName";
import useFetchMintPrice from "@/hooks/useFetchMintPrice";
import useFetchStats from "@/hooks/useFetchStats";
import { ConnectedWallet } from "@privy-io/react-auth";
import Link from "next/link";
import { zeroAddress } from "viem";
import "./StatsScreen.css";

type UserRating = {
  user: string;
  ratings: number;
  solves: number;
  minted: number;
  you: boolean;
};

type CreatorRating = {
  user: string;
  created: number;
  ratings: number;
  minted: number;
  you: boolean;
};

const UserRow = ({
  userData,
  rank,
}: {
  userData: UserRating;
  rank: number;
}) => {
  const { resolvedAddress } = useEnsName(userData.user);

  return (
    <tr className={`border-b-1 border-slate-800 ${userData.you ? "text-red-500" : ""}`}>
      <th className="text-[#596172]">{rank}</th>
      <td>
        <Link href={`/profile/${userData.user}`}>{resolvedAddress}</Link>
      </td>
      <td className="text-[#E6FA04] pixeloid-sans-bold">{userData.ratings}</td>
      <td className="text-[#E6FA04] pixeloid-sans-bold">{userData.solves}</td>
      <td className="text-[#E6FA04] pixeloid-sans-bold">{userData.minted}</td>
    </tr>
  );
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
  const { resolvedAddress } = useEnsName(creator.user);
  const earned = `$ ${(creator.minted * Number(mintPrice) * conversion).toFixed(
    2
  )}`;

  return (
    <tr className={`border-b-1 border-slate-800 ${creator.you ? "text-red-500" : ""}`}>
      <th className="text-[#596172]">{rank}</th>
      <td>
        <Link href={`/profile/${creator.user}`}>{resolvedAddress}</Link>
      </td>
      <td className="text-[#E6FA04] pixeloid-sans-bold">{earned}</td>
      <td className="text-[#E6FA04] pixeloid-sans-bold">{creator.created}</td>
    </tr>
  );
};

const StatsScreen = ({
  activeWallet,
}: {
  activeWallet: ConnectedWallet | undefined;
}) => {
  const result = {
    loading: false,
    data: {
      creators: [],
    },
  };

  const { stats, isLoading } = useFetchStats(
    activeWallet ? activeWallet.address : zeroAddress
  );

  const { mintPrice } = useFetchMintPrice(1);
  const { ethusd } = useETHConversion();

  return (
    <div role="tablist" className="tabs tabs-lifted mx-10 pixeloid-sans">
      <input
        type="radio"
        name="my_tabs_2"
        role="tab"
        className="tab [--tab-bg:#E6FA04] [--tab-border-color:#E6FA04] pixeloid-sans-bold text-lg"
        aria-label="Top Players"
        defaultChecked
      />
      <div
        role="tabpanel"
        className="tab-content bg-[#000000E5] border-none rounded-box p-6"
      >
        <div className="overflow-x-auto">
          <table className="table">
            {/* head */}
            <thead className="text-[#596172] text-base">
              <tr className="border-b-1 border-slate-800">
                <th>Rank</th>
                <th>Player</th>
                <th>Ratings</th>
                <th># Solved</th>
                <th># Minted</th>
              </tr>
            </thead>
            <tbody>
              {stats.players.map((user: UserRating, idx: number) => (
                <UserRow key={idx} userData={user} rank={idx + 1} />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <input
        type="radio"
        name="my_tabs_2"
        role="tab"
        className="tab [--tab-bg:#E6FA04] [--tab-border-color:#E6FA04] pixeloid-sans-bold text-lg"
        aria-label="Top Creators"
      />
      <div
        role="tabpanel"
        className="tab-content bg-[#000000E5] border-none rounded-box p-6 "
      >
        <div className="overflow-x-auto">
          <table className="table">
            {/* head */}
            <thead className="text-[#596172] text-base">
              <tr className="border-b-1 border-slate-800">
                <th>Rank</th>
                <th>Creator</th>
                <th>Earned (in USD) </th>
                <th># Puzzles Created </th>
              </tr>
            </thead>
            <tbody>
              {stats.creators.map((creator: CreatorRating, idx: number) => (
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
        </div>
      </div>
    </div>
  );
};

export default StatsScreen;

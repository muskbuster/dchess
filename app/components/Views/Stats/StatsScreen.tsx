import useETHConversion from "@/hooks/useETHConversion";
import useEnsName from "@/hooks/useEnsName";
import useFetchMintPrice from "@/hooks/useFetchMintPrice";
import useFetchStats from "@/hooks/useFetchStats";
import { ConnectedWallet } from "@privy-io/react-auth";
import Link from "next/link";
import { zeroAddress } from "viem";
/***** */
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
    <tr className={`${userData.you ? "text-red-500" : ""}`}>
      <th>{rank}</th>
      <td>
        <Link className="break-words" href={`/profile/${userData.user}`}>{resolvedAddress}</Link>
      </td>
      <td>{userData.ratings}</td>
      <td className="md:table-cell hidden">{userData.solves}</td>
      <td className="md:table-cell hidden">{userData.minted}</td>
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
    <tr className={`${creator.you ? "text-red-500" : ""}`}>
      <th>{rank}</th>
      <td>
        <Link className="break-words" href={`/profile/${creator.user}`}>{resolvedAddress}</Link>
      </td>
      <td>{earned}</td>
      <td className="md:table-cell hidden">{creator.created}</td>
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
    <div role="tablist" className="tabs tabs-lifted md:mx-10 mx-[5px]">
      <input
        type="radio"
        name="my_tabs_2"
        role="tab"
        className="tab [--tab-bg:#334155] [--tab-border-color:#64748b] text-white md:text-lg text-xs"
        aria-label="Top Players"
        defaultChecked
      />
      <div
        role="tabpanel"
        className="tab-content bg-slate-700 border-slate-500 rounded-box p-6"
      >
        <div className="overflow-x-auto">
          <table className="table"  >
            {/* head */}
            <thead className="text-white md:text-lg text-xs">
              <tr>
                <th>Rank</th>
                <th>Player</th>
                <th>Ratings</th>
                <th className="md:table-cell hidden"># Solved</th>
                <th className="md:table-cell hidden"># Minted</th>
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
        className="tab [--tab-bg:#334155] [--tab-border-color:#64748b] text-white md:text-lg text-xs"
        aria-label="Top Creators"
      />
      <div
        role="tabpanel"
        className="tab-content bg-slate-700 border-slate-500 rounded-box p-6 "
      >
        <div className="overflow-x-auto">
          <table className="table">
            {/* head */}
            <thead className="text-white md:text-lg text-xs">
              <tr>
                <th>Rank</th>
                <th>Creator</th>
                <th>Earned (in USD) </th>
                <th className="md:table-cell hidden"># Puzzles Created </th>
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

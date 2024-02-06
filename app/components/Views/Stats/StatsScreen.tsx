import useEnsName from "@/hooks/useEnsName";
import useFetchStats from "@/hooks/useFetchStats";
import { ConnectedWallet } from "@privy-io/react-auth";

type UserRating = {
  user: string;
  ratings: number;
  you: boolean;
};

type CreatorRating = {
  id: string;
  totalCreated: number;
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
      <td>{resolvedAddress}</td>
      <td>{userData.ratings}</td>
    </tr>
  );
};

const CreatorRow = ({
  creator,
  rank,
}: {
  creator: CreatorRating;
  rank: number;
}) => {
  return (
    <tr key={creator.id}>
      <th>{rank}</th>
      <td>{creator.id}</td>
      <td>{creator.totalCreated.toString()}</td>
    </tr>
  );
};

const StatsScreen = ({ activeWallet }: { activeWallet: ConnectedWallet }) => {
  const result = {
    loading: false,
    data: {
      creators: [],
    },
  };

  const { userStats, isLoading } = useFetchStats(activeWallet.address);

  return isLoading ? (
    <div> loading ... </div>
  ) : (
    <div role="tablist" className="tabs tabs-lifted mx-10 mt-20">
      <input
        type="radio"
        name="my_tabs_2"
        role="tab"
        className="tab [--tab-bg:#334155] [--tab-border-color:#64748b] text-white text-lg"
        aria-label="Top Players"
        defaultChecked
      />
      <div
        role="tabpanel"
        className="tab-content bg-slate-700 border-slate-500 rounded-box p-6"
      >
        <div className="overflow-x-auto">
          <table className="table">
            {/* head */}
            <thead className="text-white text-lg">
              <tr>
                <th>Rank</th>
                <th>Player</th>
                <th>Ratings</th>
              </tr>
            </thead>
            <tbody>
              {userStats.map((user: UserRating, idx: number) => (
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
        className="tab [--tab-bg:#334155] [--tab-border-color:#64748b] text-white text-lg"
        aria-label="Top Creators"
      />
      <div
        role="tabpanel"
        className="tab-content bg-slate-700 border-slate-500 rounded-box p-6 "
      >
        <div className="overflow-x-auto">
          <table className="table">
            {/* head */}
            <thead className="text-white text-lg">
              <tr>
                <th>Rank</th>
                <th>Creator</th>
                <th>Puzzles Created </th>
              </tr>
            </thead>
            <tbody>
              {result.data.creators.map(
                (creator: CreatorRating, idx: number) => (
                  <CreatorRow
                    key={creator.id}
                    creator={creator}
                    rank={idx + 1}
                  />
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StatsScreen;

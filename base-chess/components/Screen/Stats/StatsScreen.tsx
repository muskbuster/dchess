import { bigIntToOnes } from "@/utils/general";
import { RANKED_USERS } from "@/utils/graphQLQueries";
import { useQuery } from "@apollo/client";

type UserRating = {
  id: string;
  rating: bigint;
  totalSolved: bigint;
};

type CreatorRating = {
  id: string;
  totalCreated: bigint;
};

const UserRow = ({
  userData,
  rank,
}: {
  userData: UserRating;
  rank: number;
}) => {
  return (
    <tr key={userData.id}>
      <th>{rank}</th>
      <td>{userData.id}</td>
      <td>{bigIntToOnes(userData.rating)}</td>
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

const StatsScreen = () => {
  const result = useQuery(RANKED_USERS, {
    variables: { userAddress: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC" },
  });

  return result.loading ? (
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
              {result.data.users.map((user: UserRating, idx: number) => (
                <UserRow key={user.id} userData={user} rank={idx + 1} />
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

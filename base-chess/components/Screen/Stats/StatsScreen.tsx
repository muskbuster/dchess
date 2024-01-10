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

  if (!result.loading) {
    console.log("result", result.data.users);
  }
  const topPlayers = [
    ["0x161dF4dD521D905Fe0Bb5713549C607ba802db5E", 1943],
    ["0x4B9cE9983655c3f8EeF8903cAe64d9E8BB5C8a56", 1812],
    ["0xE52754a8ACfbDBc30b10bcffcCdadb6A50441e36", 1803],
    ["0xD7cA8230c3955F084b33BcAf97bDD75CA4FdD815", 1742],
    ["0x70c37CEb184653937689244F3687d387a7E3776d", 1722],
    ["0x643236b98E3E779D3F722c66E45058414ddC7b9a", 1710],
    ["0x4fDB2553861511E9126fE88BC4743A4fC7144bEA", 1699],
    ["0x102b99022238931E2C4b7F6Aec7ce9B86302A024", 1682],
    ["0x669A30aBCb9d097F2B09608DE599445e33538337", 1512],
    ["0x6C69D745BB488718E562B936Bb51c298CBD6a034", 1501],
  ];

  const topCreators = [
    ["0x161dF4dD521D905Fe0Bb5713549C607ba802db5E", 24],
    ["0x4B9cE9983655c3f8EeF8903cAe64d9E8BB5C8a56", 21],
    ["0xE52754a8ACfbDBc30b10bcffcCdadb6A50441e36", 18],
    ["0xD7cA8230c3955F084b33BcAf97bDD75CA4FdD815", 16],
    ["0x70c37CEb184653937689244F3687d387a7E3776d", 15],
    ["0x643236b98E3E779D3F722c66E45058414ddC7b9a", 15],
    ["0x4fDB2553861511E9126fE88BC4743A4fC7144bEA", 12],
    ["0x102b99022238931E2C4b7F6Aec7ce9B86302A024", 10],
    ["0x669A30aBCb9d097F2B09608DE599445e33538337", 4],
    ["0x6C69D745BB488718E562B936Bb51c298CBD6a034", 3],
  ];

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

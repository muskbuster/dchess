import { useQuery } from "@tanstack/react-query";

async function getStats() {
  return (await fetch("/api/stats").then((res) => res.json())) as string;
}

export default function useFetchStats(userAddress: string) {
  const { isError, isLoading, data } = useQuery<string>({
    queryKey: ["get-stats"],
    queryFn: () => getStats(),
  });

  let stats = {
    players: [],
    creators: [],
  };

  if (!isError && !isLoading) {
    const playerStats = JSON.parse(data!).players;
    const creatorStats = JSON.parse(data!).creators;

    stats.players = playerStats.map((u: any) => {
      return {
        user: u.user,
        ratings: u.ratings,
        solves: u.solves,
        minted: u.minted,
        you: u.user == userAddress.toLowerCase(),
      };
    });

    stats.creators = creatorStats.map((u: any) => {
      return {
        user: u.user,
        ratings: u.ratings,
        created: u.created,
        you: u.user == userAddress.toLowerCase(),
      };
    });
  }

  return { isLoading, stats };
}

import { useQuery } from "@tanstack/react-query";

async function getStats() {
  const response = await fetch("/api/stats/points");
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  return response.json();
}

export default function useFetchPointsStats(userAddress: string) {
  const { isError, isLoading, data } = useQuery<any>({
    queryKey: ["get-points-stats"],
    queryFn: () => getStats(),
  });

  let stats = {
    players: [],
  };

  if (!isError && !isLoading && data) {
    const playerStats = data.players;

    stats.players = playerStats.map((u: any) => {
      return {
        address: u.address,
        ens: u.ens,
        farcaster: u.farcaster,
        points: u.points,
        you: u.address == userAddress,
      };
    });
  }

  return { isLoading, stats };
}

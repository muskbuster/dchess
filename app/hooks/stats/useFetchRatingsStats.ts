import { useQuery } from "@tanstack/react-query";

async function getStats() {
  const response = await fetch("/api/stats/ratings");
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  return response.json();
}

export default function useFetchRatingsStats(userAddress: string) {
  const { isError, isLoading, data } = useQuery<any>({
    queryKey: ["get-ratings-stats"],
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
        ratings: u.rating,
        you: u.address == userAddress,
      };
    });
  }

  return { isLoading, stats };
}

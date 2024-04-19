import { useQuery } from "@tanstack/react-query";

async function getStats() {
  const response = await fetch("/api/stats/earnings");
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  return response.json();
}

export default function useFetchEarningsStats(userAddress: string) {
  const { isError, isLoading, data } = useQuery<any>({
    queryKey: ["get-earnings-stats"],
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
        minted: u.mint_count,
        you: u.address == userAddress,
      };
    });
  }

  return { isLoading, stats };
}

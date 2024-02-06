import { useQuery } from "@tanstack/react-query";

async function getStats() {
  return (await fetch("/api/stats").then((res) => res.json())) as string;
}

export default function useFetchStats(userAddress: string) {
  const { isError, isLoading, data } = useQuery<string>({
    queryKey: ["get-stats"],
    queryFn: () => getStats(),
  });

  let userStats = [];

  if (!isError && !isLoading) userStats = JSON.parse(data!);
  userStats = userStats.map((u: any) => {
    return {
      user: u.user,
      ratings: u.ratings,
      you: u.user == userAddress.toLowerCase(),
    };
  });

  return { isLoading, userStats };
}

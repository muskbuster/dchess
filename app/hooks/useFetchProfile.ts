import { useQuery } from "@tanstack/react-query";

async function getProfile(userAddress: string) {
  return (await fetch(`/api/profile/${userAddress}`).then((res) =>
    res.json()
  )) as string;
}

export default function useFetchProfile(userAddress: string) {
  const { isError, isLoading, data, error } = useQuery<string>({
    queryKey: ["get-profile"],
    queryFn: () => getProfile(userAddress),
  });

  let profile = {
    totalSolved: 0,
    totalAttempted: 0,
    totalMinted: 0,
    points: 0,
    ratings: 1000,
    nftsOwned: [],
    farcasterUsername: null,
    ens: null,
  };
  if (isError) console.log(error);

  if (!isError && !isLoading) {
    profile = JSON.parse(data!);
  }

  return { isLoading, profile };
}

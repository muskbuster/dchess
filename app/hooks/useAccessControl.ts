import { useQuery } from "@tanstack/react-query";
import { zeroAddress } from "viem";

async function getAccessControl(userAddress: string) {
  return (await fetch(`/api/access/${userAddress}`).then((res) =>
    res.json()
  )) as string;
}

export default function useAccessControl(userAddress: string) {
  const { isError, isLoading, data, error } = useQuery<string>({
    queryKey: ["get-access-control", userAddress],
    queryFn: () => getAccessControl(userAddress),
  });

  let getOnLeaderboard = false;
  let puzzleCreate = false;
  if (isError) console.log(error);

  if (!isError && !isLoading && userAddress != zeroAddress) {
    const nftCount = JSON.parse(data!)?.total;
    if (nftCount >= 1) getOnLeaderboard = true;
    if (nftCount >= 5) puzzleCreate = true;
  }

  return { isLoading, getOnLeaderboard, puzzleCreate };
}

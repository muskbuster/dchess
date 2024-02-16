import { ConnectedWallet } from "@privy-io/react-auth";
import { useQuery } from "@tanstack/react-query";
import { zeroAddress } from "viem";

async function getPuzzleList(userAddress: string) {
  return (await fetch(`/api/puzzles/${userAddress}`).then((res) =>
    res.json()
  )) as string;
}

export default function useFetchPuzzleList(
  activeWallet: ConnectedWallet | undefined
) {
  const address = activeWallet?.address || zeroAddress;
  const { isError, isLoading, data, error } = useQuery<string>({
    queryKey: ["get-puzzle-list"],
    queryFn: () => getPuzzleList(address),
  });

  let puzzles = [];
  if (isError) console.log(error);

  if (!isError && !isLoading) {
    puzzles = JSON.parse(data!).map((p: any) => {
      return {
        puzzle_id: Number(p.puzzle_id),
        success_rate: Math.floor(
          (Number(p.solved) / Number(p.attempted)) * 100
        ),
        solved: p.user_solved == "TRUE",
        failed: p.user_solved == "FALSE" && p.user_attempted == "TRUE",
      };
    });
  }
  console.log(puzzles);

  return { isLoading, puzzles };
}

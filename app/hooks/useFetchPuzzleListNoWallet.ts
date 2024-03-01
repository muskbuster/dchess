import { useQuery } from "@tanstack/react-query";
import { zeroAddress } from "viem";

async function getPuzzleList(userAddress: string) {
  const response = await fetch(`/api/puzzles/${userAddress}`);
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  return response.json();
}

export default function useFetchPuzzleListNoWallet() {
  const address = zeroAddress;
  const { isError, isLoading, data, error } = useQuery<string>({
    queryKey: ["get-puzzle-list-no-wallet"],
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
      };
    });
  }

  return { isLoading, puzzles };
}

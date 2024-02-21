import { ConnectedWallet } from "@privy-io/react-auth";
import { useQuery } from "@tanstack/react-query";

async function getPuzzleList(userAddress: string) {
  const response = await fetch(`/api/puzzles/${userAddress}`);
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  return response.json();
}

export default function useFetchPuzzleList(activeWallet: ConnectedWallet) {
  const address = activeWallet?.address;
  const { isError, isLoading, data, error } = useQuery<string>({
    queryKey: ["get-puzzle-list"],
    queryFn: () => getPuzzleList(address),
  });

  let puzzles = [];
  if (isError) console.log("ERORORERE", error);

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

  return { isLoading, puzzles };
}

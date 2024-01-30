import { Address, useContractRead } from "wagmi";
import DChess from "@/utils/abi/DChess.json";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as Address;

export default function useHasSolved(puzzleId: number, address: Address) {
  const { data, isLoading, isError, refetch, error } = useContractRead({
    abi: DChess.abi,
    address: CONTRACT_ADDRESS,
    functionName: "userHasSolvedPuzzle",
    args: [puzzleId, address],
  });

  return { data, isLoading, isError, refetch, error };
}

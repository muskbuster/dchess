/*
import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import DChess from "@/utils/abi/DChess.json";
import { Address, parseEther } from "viem";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as Address;

export default function useMint(puzzleId: string, valueStr: string) {
  const parsedPuzzleId = (Number(puzzleId) - 1).toString();
  const {
    error: prepareError,
    isError: isPrepareError,
    refetch,
  } = useSimulateContract({
    address: CONTRACT_ADDRESS,
    abi: DChess.abi,
    functionName: "mint",
    args: [parsedPuzzleId],
    value: parseEther(valueStr),
  });

  const { data, error, isError, writeContract } = useWriteContract(config);

  const { isLoading, isSuccess } = useWaitForTransactionReceipt({
    hash: data,
  });

  return {
    writeContract,
    refetch,
    isLoading,
    isError,
    error,
    isSuccess,
    prepareError,
    isPrepareError,
  };
}
*/

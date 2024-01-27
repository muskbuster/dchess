import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import DChess from "@/utils/abi/DChess.json";
import { Address } from "viem";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as Address;

export default function useSubmitSolution(
  puzzleId: string,
  hashedSolution: string
) {
  const parsedPuzzleId = (Number(puzzleId) - 1).toString();
  const {
    config,
    error: prepareError,
    isError: isPrepareError,
    refetch,
  } = usePrepareContractWrite({
    address: CONTRACT_ADDRESS,
    abi: DChess.abi,
    functionName: "submitSolution",
    args: [parsedPuzzleId, hashedSolution],
    enabled: false,
  });

  const { data, error, isError, write } = useContractWrite(config);

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  return {
    write,
    refetch,
    isLoading,
    isError,
    error,
    isSuccess,
    prepareError,
    isPrepareError,
  };
}

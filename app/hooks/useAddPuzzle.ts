import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import DChess from "@/utils/abi/DChess.json";
import { Address } from "viem";
import { hashed } from "@/utils/general";
import { FENToBoard } from "@/utils/boardEncoder";
import { getProof } from "@/utils/creatorWhitelist";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as Address;

export default function useAddPuzzle(
  fen: string,
  solution: string,
  description: string,
  userAddress: string
) {
  const solutionHashed = hashed(solution);
  const boardPosition = FENToBoard(fen);
  const proof = getProof(userAddress);
  const {
    config,
    error: prepareError,
    isError: isPrepareError,
    refetch,
  } = usePrepareContractWrite({
    address: CONTRACT_ADDRESS,
    abi: DChess.abi,
    functionName: "addPuzzle",
    args: [fen, solutionHashed, boardPosition, description, proof],
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

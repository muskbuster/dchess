import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import DChess from "@/utils/abi/DChess.json";
import { Address, zeroAddress } from "viem";
import { hashed } from "@/utils/general";
import { FENToBoard } from "@/utils/boardEncoder";
import { getProof } from "@/utils/creatorWhitelist";
import { ConnectedWallet } from "@privy-io/react-auth";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as Address;

export default function useAddPuzzle(
  fen: string,
  solution: string,
  description: string,
  activeWallet: ConnectedWallet | undefined
) {
  const userAddress = activeWallet ? activeWallet.address : zeroAddress;
  const solutionHashed = hashed(solution);
  const boardPosition = FENToBoard(fen);
  const proof = getProof(userAddress);
  const {
    config,
    error: prepareError,
    isError: isPrepareError,
  } = usePrepareContractWrite({
    address: CONTRACT_ADDRESS,
    abi: DChess.abi,
    functionName: "addPuzzle",
    args: [fen, solutionHashed, boardPosition, description, proof],
  });

  const { data, error, isError, write } = useContractWrite(config);

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  return {
    write,
    isLoading,
    isError,
    error,
    isSuccess,
    prepareError,
    isPrepareError,
  };
}

import { Address, useContractRead } from "wagmi";
import DChess from "@/utils/abi/DChess.json";
import { ConnectedWallet } from "@privy-io/react-auth";
import { zeroAddress } from "viem";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as Address;

export default function useHasAttempted(
  puzzleId: number,
  activeWallet: ConnectedWallet | undefined,
  loggedIn: boolean
) {
  const address = loggedIn && activeWallet ? activeWallet.address : zeroAddress;
  const { data, isLoading, isError, refetch, error } = useContractRead({
    abi: DChess.abi,
    address: CONTRACT_ADDRESS,
    functionName: "userHasAttemptedPuzzle",
    args: [puzzleId, address],
  });

  return { data, isLoading, isError, refetch, error };
}

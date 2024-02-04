import { Address, useContractRead } from "wagmi";
import DChess from "@/utils/abi/DChess.json";
import { formatEther } from "viem";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as Address;

export default function useFetchMintPrice() {
  const { data, isLoading, isError } = useContractRead({
    abi: DChess.abi,
    address: CONTRACT_ADDRESS,
    functionName: "tokenMintPrice",
  });

  let mintPrice = "0.000";
  if (!isError && !isLoading) mintPrice = formatEther(data as bigint);

  return { mintPrice, isLoading, isError };
}

import { formatEther } from "viem";

export function truncateAddress(address: string) {
  return (
    address.slice(0, 9) +
    "..." +
    address.slice(address.length - 5, address.length)
  );
}

// Convert big number to rounded number with 1 decimal place
export const bigIntToOnes = (n: bigint) => {
  return formatEther(n).split(".")[0];
};

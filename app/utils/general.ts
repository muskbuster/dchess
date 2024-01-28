import { Address, formatEther, keccak256, stringToBytes } from "viem";

export function truncateAddress(address: Address) {
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

export function hashed(str: string) {
  // first convert to bytes
  const _bytes = stringToBytes(str);
  // then hash it
  return keccak256(_bytes);
}

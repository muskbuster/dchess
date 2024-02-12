import { Address, keccak256, stringToBytes } from "viem";
import whitelistedCreators from "@/utils/whitelistedCreators.json";

export function truncateAddress(address: Address) {
  return (
    address.slice(0, 9) +
    "..." +
    address.slice(address.length - 5, address.length)
  );
}

export function hashed(str: string) {
  // first convert to bytes
  const _bytes = stringToBytes(str);
  // then hash it
  return keccak256(_bytes);
}

export function canonicalFen(fen: string) {
  let fenArr = fen.split(" ");
  fenArr[5] = "1";

  return fenArr.join(" ");
}

export function whitelistedCreator(userAddress: string) {
  return whitelistedCreators.indexOf(userAddress) !== -1;
}

export function timeout(delay: number) {
  return new Promise((res) => setTimeout(res, delay));
}

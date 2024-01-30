import { MerkleTree } from "merkletreejs";
import { Address, encodePacked, keccak256 } from "viem";

import whitelistedCreators from "./whitelistedCreators.json";

export function getProof(addr: string) {
  const leaves = whitelistedCreators.map((address) =>
    keccak256(encodePacked(["address"], [address as Address]))
  );
  const tree = new MerkleTree(leaves, keccak256, { sort: true });
  const index = whitelistedCreators.indexOf(addr as never);
  const proof = tree.getHexProof(leaves[index]);
  return proof;
}

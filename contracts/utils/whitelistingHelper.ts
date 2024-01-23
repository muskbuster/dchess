import { ethers } from "hardhat";
import { MerkleTree } from "merkletreejs";
import keccak256 from "keccak256";

import whitelistedCreators from "../data/whitelistedCreators.json";

export function getMerkleRoot(creators: string[]) {
    const leaves = creators.map((address) =>
        ethers.solidityPackedKeccak256(["address"], [address]),
    );
    const tree = new MerkleTree(leaves, keccak256, { sort: true });
    return tree.getHexRoot();
}

export function getProof(creators: string[], addr: string) {
    const leaves = creators.map((address) =>
        ethers.solidityPackedKeccak256(["address"], [address]),
    );
    const tree = new MerkleTree(leaves, keccak256, { sort: true });
    const index = creators.indexOf(addr as never);
    const proof = tree.getHexProof(leaves[index]);
    return proof;
}

import { writeFileSync } from "fs"
import { ethers } from "hardhat"
import { tokenURIToHtml } from "./frontend"

export const parseAndSaveTokenUri = (
	tokenUri: string,
	outName: string = "a.html"
) => {
	const htmlContent = tokenURIToHtml(tokenUri)
	writeFileSync(`./${outName}`, htmlContent)
	return
}

export function hashed(str: string) {
	// first convert to bytes
	const _bytes = ethers.toUtf8Bytes(str)
	// then hash it
	return ethers.keccak256(_bytes)
}

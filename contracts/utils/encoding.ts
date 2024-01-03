import { writeFileSync } from "fs"
import { ethers } from "hardhat"

export const tokenURIToHtml = (tokenURI: string): string => {
	const base64Token = tokenURI.split(",")[1]
	const decodedBase64Token = atob(base64Token)
	const decodedJSON = JSON.parse(decodedBase64Token)
	const encodedAnimation = decodedJSON.animation_url.split(",")[1]
	return atob(encodedAnimation)
}

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

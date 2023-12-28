import { writeFileSync } from "fs"

export const tokenURIToHtml = (tokenURI: string): string => {
	const base64Token = tokenURI.split(",")[1]
	const decodedBase64Token = atob(base64Token)
	console.log("decoded base64", decodedBase64Token)
	console.log("problematic", decodedBase64Token.substring(67, 69))
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

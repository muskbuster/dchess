export const tokenURIToHtml = (tokenURI: string): string => {
	const base64Token = tokenURI.split(",")[1]
	const decodedBase64Token = atob(base64Token)
	const decodedJSON = JSON.parse(decodedBase64Token)
	const encodedAnimation = decodedJSON.animation_url.split(",")[1]
	return `<body style="margin: 0px">
	<div style="transform: scale(0.25); transform-origin: 0px 0px; width: 250px; height: 250px;"> ${atob(
		encodedAnimation
	)} </div>
	</body>
	`
}

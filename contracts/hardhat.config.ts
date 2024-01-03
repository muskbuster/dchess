import { HardhatUserConfig } from "hardhat/config"
import "@nomicfoundation/hardhat-toolbox"
import "hardhat-deploy"
import dotenv from "dotenv"

dotenv.config()

const PRIVATE_KEY = process.env.PRIVATE_KEY! as string
const ALCHEMY_BASE_GOERLI_HTTPS = process.env.ALCHEMY_BASE_GOERLI_HTTPS
	? process.env.ALCHEMY_BASE_GOERLI_HTTPS
	: "https://goerli.base.org"

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY as string

const config: HardhatUserConfig = {
	solidity: {
		compilers: [
			{
				version: "0.8.20",
				settings: {
					optimizer: {
						enabled: true,
					},
				},
			},
		],
	},
	networks: {
		hardhat: {
			forking: {
				url: ALCHEMY_BASE_GOERLI_HTTPS,
			},
		},
		// for mainnet
		"base-mainnet": {
			url: ALCHEMY_BASE_GOERLI_HTTPS,
			accounts: PRIVATE_KEY ? [PRIVATE_KEY] : "remote",
		},
		// for testnet
		"base-goerli": {
			url: ALCHEMY_BASE_GOERLI_HTTPS,
			accounts: PRIVATE_KEY ? [PRIVATE_KEY] : "remote",
		},
		localhost: {
			url: "http://localhost:8545",
			gasPrice: 1000000000,
			chainId: 111,
		},
	},
	etherscan: {
		apiKey: {
			"base-goerli": ETHERSCAN_API_KEY,
		},
		customChains: [
			{
				network: "base-goerli",
				chainId: 84531,
				urls: {
					apiURL: "https://api-goerli.basescan.org/api",
					browserURL: "https://goerli.basescan.org",
				},
			},
		],
	},
}

export default config

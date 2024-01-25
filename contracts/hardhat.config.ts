import { HardhatUserConfig, task } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-deploy";
import dotenv from "dotenv";

dotenv.config();

const ALCHEMY_BASE_SEPOLIA_HTTPS = process.env.ALCHEMY_BASE_SEPOLIA_HTTPS;
const ALCHEMY_BASE_GOERLI_HTTPS = process.env.ALCHEMY_BASE_GOERLI_HTTPS;
const ALCHEMY_BASE_HTTPS = process.env.ALCHEMY_BASE_HTTPS;

const BASESCAN_API_KEY = process.env.BASESCAN_API_KEY as string;

const OWNER_PRIVATE_KEY = process.env.OWNER_PRIVATE_KEY! as string;
const TEST_PRIVATE_KEY1 = process.env.TEST_PRIVATE_KEY1! as string;
const TEST_PRIVATE_KEY2 = process.env.TEST_PRIVATE_KEY2! as string;
const TEST_PRIVATE_KEY3 = process.env.TEST_PRIVATE_KEY3! as string;
const TEST_PRIVATE_KEY4 = process.env.TEST_PRIVATE_KEY4! as string;
const TEST_PRIVATE_KEY5 = process.env.TEST_PRIVATE_KEY5! as string;

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
            deploy: ["deploy/local/"],
        },
        // for mainnet
        "base-mainnet": {
            url: ALCHEMY_BASE_HTTPS,
            accounts: [OWNER_PRIVATE_KEY],
            deploy: ["deploy/mainnet/"],
        },
        // for testnet
        "base-sepolia": {
            url: ALCHEMY_BASE_SEPOLIA_HTTPS,
            accounts: [
                OWNER_PRIVATE_KEY,
                TEST_PRIVATE_KEY1,
                TEST_PRIVATE_KEY2,
                TEST_PRIVATE_KEY3,
                TEST_PRIVATE_KEY4,
                TEST_PRIVATE_KEY5,
            ],
            deploy: ["deploy/testnet/"],
            verify: {
                etherscan: {
                    apiKey: BASESCAN_API_KEY,
                    apiUrl: "https://api-sepolia.basescan.org/api",
                },
            },
        },
        "base-goerli": {
            url: ALCHEMY_BASE_GOERLI_HTTPS,
            accounts: [
                OWNER_PRIVATE_KEY,
                TEST_PRIVATE_KEY1,
                TEST_PRIVATE_KEY2,
                TEST_PRIVATE_KEY3,
                TEST_PRIVATE_KEY4,
                TEST_PRIVATE_KEY5,
            ],
            deploy: ["deploy/testnet/"],
            verify: {
                etherscan: {
                    apiKey: BASESCAN_API_KEY,
                    apiUrl: "https://api-goerli.basescan.org/api",
                },
            },
        },
        localhost: {
            url: "http://localhost:8545",
            gasPrice: 1000000000,
            chainId: 111,
            deploy: ["deploy/local/"],
        },
    },
    etherscan: {
        apiKey: {
            "base-sepolia": BASESCAN_API_KEY,
        },
        customChains: [
            {
                network: "base-sepolia",
                chainId: 84532,
                urls: {
                    apiURL: "https://api-sepolia.basescan.org/api",
                    browserURL: "https://sepolia.basescan.org/",
                },
            },
        ],
    },
};

export default config;

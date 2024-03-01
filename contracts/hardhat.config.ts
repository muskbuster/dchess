import { HardhatUserConfig, task } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-deploy";
import "hardhat-gas-reporter";

import dotenv from "dotenv";

dotenv.config();

const ALCHEMY_BASE_SEPOLIA_HTTPS = process.env.ALCHEMY_BASE_SEPOLIA_HTTPS;
const ALCHEMY_BASE_GOERLI_HTTPS = process.env.ALCHEMY_BASE_GOERLI_HTTPS;
const ALCHEMY_BASE_HTTPS = process.env.ALCHEMY_BASE_HTTPS;
const BASESCAN_API_KEY = process.env.BASESCAN_API_KEY as string;
const REPORT_GAS = process.env.REPORT_GAS as string;

const OWNER_PRIVATE_KEY = process.env.OWNER_PRIVATE_KEY! as string;
const TEST_PRIVATE_KEY1 = process.env.TEST_PRIVATE_KEY1! as string;
const TEST_PRIVATE_KEY2 = process.env.TEST_PRIVATE_KEY2! as string;
const TEST_PRIVATE_KEY3 = process.env.TEST_PRIVATE_KEY3! as string;
const TEST_PRIVATE_KEY4 = process.env.TEST_PRIVATE_KEY4! as string;
const TEST_PRIVATE_KEY5 = process.env.TEST_PRIVATE_KEY5! as string;
const TEST_PRIVATE_KEY6 = process.env.TEST_PRIVATE_KEY6! as string;
const TEST_PRIVATE_KEY7 = process.env.TEST_PRIVATE_KEY7! as string;
const TEST_PRIVATE_KEY8 = process.env.TEST_PRIVATE_KEY8! as string;
const TEST_PRIVATE_KEY9 = process.env.TEST_PRIVATE_KEY9! as string;
const TEST_PRIVATE_KEY10 = process.env.TEST_PRIVATE_KEY10! as string;
const TEST_PRIVATE_KEY11 = process.env.TEST_PRIVATE_KEY11! as string;
const TEST_PRIVATE_KEY12 = process.env.TEST_PRIVATE_KEY12! as string;
const TEST_PRIVATE_KEY13 = process.env.TEST_PRIVATE_KEY13! as string;

const TEST_ACCOUNTS = [
    OWNER_PRIVATE_KEY,
    TEST_PRIVATE_KEY1,
    TEST_PRIVATE_KEY2,
    TEST_PRIVATE_KEY3,
    TEST_PRIVATE_KEY4,
    TEST_PRIVATE_KEY5,
    TEST_PRIVATE_KEY6,
    TEST_PRIVATE_KEY7,
    TEST_PRIVATE_KEY8,
    TEST_PRIVATE_KEY9,
    TEST_PRIVATE_KEY10,
    TEST_PRIVATE_KEY11,
    TEST_PRIVATE_KEY12,
    TEST_PRIVATE_KEY13,
];

const config: HardhatUserConfig = {
    solidity: {
        compilers: [
            {
                version: "0.8.20",
                settings: {
                    optimizer: {
                        enabled: true,
                    },
                    viaIR: true,
                },
            },
        ],
    },
    networks: {
        hardhat: {
            deploy: ["deploy/local/"],
            allowUnlimitedContractSize: true,
        },
        // for mainnet
        base: {
            url: ALCHEMY_BASE_HTTPS,
            accounts: [OWNER_PRIVATE_KEY],
            deploy: ["deploy/mainnet/"],
        },
        // for testnet
        "base-sepolia": {
            url: ALCHEMY_BASE_SEPOLIA_HTTPS,
            accounts: TEST_ACCOUNTS,
            deploy: ["deploy/testnet/"],
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
            base: BASESCAN_API_KEY,
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
    gasReporter: {
        enabled: REPORT_GAS ? true : false,
    },
};

export default config;

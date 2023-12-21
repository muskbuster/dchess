import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-deploy";

const PRIVATE_KEY = process.env.PRIVATE_KEY! as string;
const ALCHEMY_BASE_GOERLI_HTTPS = process.env.ALCHEMY_BASE_GOERLI_HTTPS
  ? process.env.ALCHEMY_BASE_GOERLI_HTTPS
  : "https://goerli.base.org";
const ALCHEMY_BASE_HTTPS = process.env.ALCHEMY_BASE_HTTPS as string;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY as string;

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  networks: {
    // for mainnet
    "base-mainnet": {
      url: ALCHEMY_BASE_GOERLI_HTTPS,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : "remote",
      gasPrice: 1000000000,
    },
    // for testnet
    "base-goerli": {
      url: ALCHEMY_BASE_GOERLI_HTTPS,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : "remote",
      gasPrice: 1000000000,
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
};

export default config;

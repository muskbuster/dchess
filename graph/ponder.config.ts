import { createConfig } from "@ponder/core";
import { http } from "viem";

import { BoardAbi } from "./abis/Board";

export default createConfig({
  networks: {
    localhost: {
      chainId: 100,
      transport: http(process.env.PONDER_RPC_URL_1),
    },
  },
  contracts: {
    Board: {
      network: "localhost",
      abi: BoardAbi,
      address: "0x3de00f44ce68FC56DB0e0E33aD4015C6e78eCB39", // From dev setup in contracts/repo
    },
  },
});

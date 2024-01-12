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
      address: "0x92A00fc48Ad3dD4A8b5266a8F467a52Ac784fC83", // From dev setup in contracts/repo
    },
  },
});

"use client";

import { PrivyProvider, User } from "@privy-io/react-auth";
import { PrivyWagmiConnector } from "@privy-io/wagmi-connector";
import { base, baseGoerli, foundry } from "@wagmi/chains";
import { configureChains } from "wagmi";
import { jsonRpcProvider } from "@wagmi/core/providers/jsonRpc";
import { QueryClient } from "react-query";
import WalletWrapper from "@/components/Common/WalletWrapper";
import { RPC_URL } from "@/utils/addresses";

const configureChainsConfig = configureChains(
  [foundry],
  [
    jsonRpcProvider({
      rpc: (chain) => ({
        http: RPC_URL, // process.env.NEXT_PUBLIC_ALCHEMY_HTTPS as string,
        webSocket: RPC_URL, // process.env.NEXT_PUBLIC_ALCHEMY_WSS as string,
      }),
    }),
  ]
);

const PrivyWrapper = ({
  page,
  args,
}: {
  page: "Create" | "Play" | "Stats" | "Profile";
  args?: any;
}) => {
  const handleLogin = async (user: User) => {
    console.log("User logged in: ", user);
    window.location.reload();
  };

  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID as string}
      config={{
        loginMethods: ["wallet", "sms", "google"],
        appearance: {
          theme: "dark",
          accentColor: "#676FFF",
        },
        defaultChain: foundry,
        supportedChains: [foundry],
      }}
      onSuccess={handleLogin}
    >
      <PrivyWagmiConnector wagmiChainsConfig={configureChainsConfig}>
        <WalletWrapper page={page} args={args} />
      </PrivyWagmiConnector>
    </PrivyProvider>
  );
};

export default PrivyWrapper;

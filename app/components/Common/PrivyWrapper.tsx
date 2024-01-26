"use client";

import { PrivyProvider, User } from "@privy-io/react-auth";
import { PrivyWagmiConnector } from "@privy-io/wagmi-connector";
import { baseSepolia } from "viem/chains";
import { configureChains } from "wagmi";
import { jsonRpcProvider } from "@wagmi/core/providers/jsonRpc";
import { QueryClient, QueryClientProvider } from "react-query";
import WalletWrapper from "@/components/Common/WalletWrapper";

const configureChainsConfig = configureChains(
  [baseSepolia],
  [
    jsonRpcProvider({
      rpc: (chain) => ({
        http: process.env.NEXT_PUBLIC_ALCHEMY_HTTPS as string,
        webSocket: process.env.NEXT_PUBLIC_ALCHEMY_WSS as string,
      }),
    }),
  ]
);

const queryClient = new QueryClient();

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
      }}
      onSuccess={handleLogin}
    >
      <PrivyWagmiConnector wagmiChainsConfig={configureChainsConfig}>
        <QueryClientProvider client={queryClient}>
          <WalletWrapper page={page} args={args} />
        </QueryClientProvider>
      </PrivyWagmiConnector>
    </PrivyProvider>
  );
};

export default PrivyWrapper;

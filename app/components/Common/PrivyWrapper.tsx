"use client";

import { PrivyProvider, User } from "@privy-io/react-auth";
import { PrivyWagmiConnector } from "@privy-io/wagmi-connector";
import { baseSepolia } from "viem/chains";
import { configureChains } from "wagmi";
import { jsonRpcProvider } from "@wagmi/core/providers/jsonRpc";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import WalletWrapper from "@/components/Common/WalletWrapper";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { timeout } from "@/utils/general";

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

const client = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT as string,
  cache: new InMemoryCache(),
});

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
    await timeout(2000); // hack to ensure wallet is created
    window.location.reload();
  };

  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID as string}
      config={{
        loginMethods: ["sms", "wallet"],
        appearance: {
          theme: "dark",
          accentColor: "#676FFF",
        },
        embeddedWallets: {
          createOnLogin: "users-without-wallets",
        },
      }}
      onSuccess={handleLogin}
    >
      <PrivyWagmiConnector wagmiChainsConfig={configureChainsConfig}>
        <ApolloProvider client={client}>
          <QueryClientProvider client={queryClient}>
            <WalletWrapper page={page} args={args} />
          </QueryClientProvider>
        </ApolloProvider>
      </PrivyWagmiConnector>
    </PrivyProvider>
  );
};

export default PrivyWrapper;
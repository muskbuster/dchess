import { usePrivy, useWallets, ConnectedWallet } from "@privy-io/react-auth";
import { usePrivyWagmi } from "@privy-io/wagmi-connector";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import NavBar from "@/components/Layout/NavBar";
import CreateScreen from "../Screen/Create/CreateScreen";
import PlayScreen from "../Screen/Play/PlayScreen";
import StatsScreen from "../Screen/Stats/StatsScreen";
import ProfileScreen from "../Screen/Profile/ProfileScreen";

const WalletWrapper = ({
  page,
}: {
  page: "Create" | "Play" | "Stats" | "Profile";
}) => {
  const { wallets } = useWallets();
  const { ready, authenticated } = usePrivy();
  const router = useRouter();
  const { wallet: activeWallet, setActiveWallet } = usePrivyWagmi();

  /* Switch wallets as soon as its available */
  useEffect(() => {
    const embeddedWallet = wallets.find(
      (wallet) => wallet.walletClientType === "privy"
    ) as ConnectedWallet;

    if (embeddedWallet) {
      const chainId = Number(process.env.NEXT_PUBLIC_CHAIN_ID);
      (async () => await embeddedWallet.switchChain(chainId))();
      setActiveWallet(embeddedWallet);
    }
  }, [wallets, setActiveWallet]);

  const screen = (() => {
    switch (page) {
      case "Play":
        return <PlayScreen />;
      case "Create":
        return <CreateScreen />;
      case "Stats":
        return <StatsScreen />;
      case "Profile":
        return <ProfileScreen />;
    }
  })();

  const LoadingScreen = (
    <div className="flex items-center justify-center w-screen h-screen">
      <span className="loading loading-spinner loading-lg"></span>
    </div>
  );

  return ready ? (
    <div>
      <NavBar loggedIn={authenticated} />
      <div className="m-2">{screen}</div>
    </div>
  ) : (
    LoadingScreen
  );
};

export default WalletWrapper;

import { useEffect } from "react";
import { usePrivy, useWallets, ConnectedWallet } from "@privy-io/react-auth";
import { usePrivyWagmi } from "@privy-io/wagmi-connector";

import NavBar from "@/components/Styled/NavBar";
import CreateScreen from "../Screen/Create/CreateScreen";
import PlayScreen from "../Screen/Play/PlayScreen";
import StatsScreen from "../Screen/Stats/StatsScreen";
import ProfileScreen from "../Screen/Profile/ProfileScreen";

const WalletWrapper = ({
  page,
  args,
}: {
  page: "Create" | "Play" | "Stats" | "Profile";
  args?: any;
}) => {
  const { wallets } = useWallets();
  const { ready, authenticated } = usePrivy();
  const { wallet: activeWallet, setActiveWallet } = usePrivyWagmi();

  /* Switch wallets as soon as its available */
  useEffect(() => {
    if (!ready) return;

    const chainId = Number(process.env.NEXT_PUBLIC_CHAIN_ID);
    if (activeWallet) {
      (async () => await activeWallet.switchChain(chainId))();
    }
  }, [ready, activeWallet]);

  /* Set active wallet if embedded wallet available (double-check if needed) */
  useEffect(() => {
    if (!ready) return;

    const embeddedWallet = wallets.find(
      (wallet) => wallet.walletClientType === "privy"
    ) as ConnectedWallet;

    if (embeddedWallet && !activeWallet) {
      setActiveWallet(embeddedWallet);
    }
  }, [ready, activeWallet, setActiveWallet, wallets]);

  const screen = (() => {
    switch (page) {
      case "Play":
        return (
          <PlayScreen
            loggedIn={authenticated}
            activeWallet={activeWallet as ConnectedWallet} // guaranteed to be there
          />
        );
      case "Create":
        return <CreateScreen activeWallet={activeWallet as ConnectedWallet} />;
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

  return ready && activeWallet ? (
    <div>
      <NavBar loggedIn={authenticated} />
      <div className="m-2">{screen}</div>
    </div>
  ) : (
    LoadingScreen
  );
};

export default WalletWrapper;

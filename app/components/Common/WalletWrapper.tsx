import { useEffect } from "react";
import { usePrivy, useWallets, ConnectedWallet } from "@privy-io/react-auth";
import { usePrivyWagmi } from "@privy-io/wagmi-connector";

import NavBar from "@/components/Styled/NavBar";
import CreateScreen from "@/components/Views/Create/CreateScreen";
import PlayScreen from "@/components/Views/Play/PlayScreen";
import StatsScreen from "@/components/Views/Stats/StatsScreen";
import ProfileScreen from "@/components/Views/Profile/ProfileScreen";
import { Footer } from "../Styled/Footer";
import { UserInfoProvider } from "@/contexts/UserInfoContext";

const PleaseLogInAlert = () => {
  return (
    <div className="w-full flex items-center justify-center">
      <div
        role="alert"
        className="alert absolute top-14 z-50 h-fit w-fit flex flex-row items-center justify-center pr-10"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          className="stroke-info shrink-0 w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        <span>Please connect wallet!</span>
      </div>
    </div>
  );
};

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

    // easier debugging
    console.log("user ready? ", ready);
    console.log("user authenticated? ", authenticated);
    console.log("wallets available: ", wallets);

    if (embeddedWallet && !activeWallet) {
      setActiveWallet(embeddedWallet);
    }
  }, [ready, activeWallet, setActiveWallet, wallets, authenticated]);

  const screen = (() => {
    switch (page) {
      case "Play":
        return (
          <PlayScreen loggedIn={authenticated} activeWallet={activeWallet} />
        );
      case "Create":
        return <CreateScreen activeWallet={activeWallet} />;
      case "Stats":
        return <StatsScreen activeWallet={activeWallet} />;
      case "Profile":
        return (
          <ProfileScreen loggedIn={authenticated} address={args.address} />
        );
    }
  })();

  const LoadingScreen = (
    <div className="flex items-center justify-center w-screen h-screen">
      <span className="loading loading-spinner loading-lg"></span>
    </div>
  );

  return ready ? (
    <UserInfoProvider>
      <div className="flex flex-col min-h-screen">
        <NavBar loggedIn={authenticated} />
        <div className="grow">
          {!authenticated && <PleaseLogInAlert />}
          <div className="m-2 mt-36 mb-36">{screen}</div>
        </div>
        <Footer />
      </div>
    </UserInfoProvider>
  ) : (
    LoadingScreen
  );
};

export default WalletWrapper;

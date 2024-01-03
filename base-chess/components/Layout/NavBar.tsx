import Link from "next/link";

import { StyledButton } from "./StyledButton";
import { usePrivy } from "@privy-io/react-auth";
import { useAccount, useBalance } from "wagmi";

const NavBar = ({ loggedIn = false }: { loggedIn: boolean }) => {
  const { login } = usePrivy();
  const { address } = useAccount();
  const {
    data: rawBalance,
    isError,
    isLoading,
  } = useBalance({
    address,
  });

  let balance = "0.0";
  if (!isError && !isLoading) {
    balance = Number(rawBalance?.formatted).toFixed(4);
  }
  let rank = 1200;

  return (
    <nav className="navbar flex flex-row bg-slate-600 border-b border-white p-2 justify-between">
      <div className="flex flex-row space-x-2">
        <Link href="/">
          <StyledButton wide={false}>Play</StyledButton>
        </Link>
        <Link href="/create">
          <StyledButton wide={false}>Create</StyledButton>
        </Link>
        <Link href="/stats">
          <StyledButton wide={false}>Leaderboard</StyledButton>
        </Link>
      </div>
      <div>
        {loggedIn ? (
          <Link href="/profile">
            <div className="h-12 bg-white rounded-lg text-black flex items-center px-4">
              {`${rank} ${balance} ETH`}
            </div>
          </Link>
        ) : (
          <StyledButton wide={false} onClick={login}>
            Log in
          </StyledButton>
        )}
      </div>
    </nav>
  );
};

export default NavBar;

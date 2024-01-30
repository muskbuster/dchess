import Link from "next/link";

import { StyledButton } from "./Button";
import { usePrivy } from "@privy-io/react-auth";
import { useAccount } from "wagmi";
import LoggedInNavBar from "./LoggedInNavBar";

const NavBar = ({ loggedIn = false }: { loggedIn: boolean }) => {
  const { login } = usePrivy();
  const { address } = useAccount();

  return (
    <nav className="navbar flex flex-row bg-slate-600 border-b border-white p-2 justify-between">
      <div className="flex flex-row space-x-2">
        <Link href="/play/1">
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
        {loggedIn && address ? (
          <LoggedInNavBar address={address} />
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

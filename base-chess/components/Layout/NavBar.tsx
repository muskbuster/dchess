import Link from "next/link";

import { StyledButton } from "./StyledButton";
import { usePrivy } from "@privy-io/react-auth";

const NavBar = ({ loggedIn = false }: { loggedIn: boolean }) => {
  const { login } = usePrivy();

  const balance = 0.001;
  const rank = 1200;

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
          <StyledButton wide={false}>Stats</StyledButton>
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

import Link from "next/link";

import { StyledButton } from "./StyledButton";
import { usePrivy } from "@privy-io/react-auth";
import { useAccount, useBalance } from "wagmi";
import { useQuery } from "@apollo/client";
import { SINGLE_USER_RATING } from "@/utils/graphQLQueries";
import { bigIntToOnes } from "@/utils/general";
import Ribbon from "../../public/Ribbon.svg";
import EthIcon from "../../public/Ethereum.svg";

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

  const userRating = useQuery(SINGLE_USER_RATING, {
    variables: { userAddress: address },
  });

  let balance = "0.0";
  if (!isError && !isLoading) {
    balance = Number(rawBalance?.formatted).toFixed(4);
  }

  console.log("rating", userRating); //.user.rating);

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
        {loggedIn && !userRating.loading ? (
          <Link href="/profile">
            <div className="flex">
              <div className="h-12 bg-white rounded-lg text-black flex items-center px-4">
                <Ribbon className="h-6 w-6" />
                {userRating.data.user
                  ? bigIntToOnes(userRating.data.user.rating)
                  : "--"}
                <EthIcon className="h-6 w-6 ml-2" /> {balance} ETH
              </div>
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

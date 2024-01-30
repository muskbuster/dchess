import Link from "next/link";

import { useBalance } from "wagmi";
import Ribbon from "../../public/Ribbon.svg";
import EthIcon from "../../public/Ethereum.svg";
import useFetchRatings from "@/hooks/useFetchRatings";
import { Address } from "viem";

const LoggedInNavBar = ({ address }: { address: Address }) => {
  const {
    data: rawBalance,
    isError,
    isLoading,
  } = useBalance({
    address,
  });

  const { rating: userRating } = useFetchRatings(address);

  let balance = "0.0";
  if (!isError && !isLoading) {
    balance = Number(rawBalance?.formatted).toFixed(4);
  }

  return (
    <Link href="/profile">
      <div className="flex">
        <div className="h-12 bg-white rounded-lg text-black flex items-center px-4">
          <Ribbon className="h-6 w-6" />
          {userRating}
          <EthIcon className="h-6 w-6 ml-2" /> {balance} ETH
        </div>
      </div>
    </Link>
  );
};

export default LoggedInNavBar;

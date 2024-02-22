import Link from "next/link";
import { minidenticon } from "minidenticons";
import { useEffect, useMemo, useState } from "react";

import { useBalance } from "wagmi";
import Ribbon from "../../public/Ribbon.svg";
import EthIcon from "../../public/Ethereum.svg";
import useFetchRatings from "@/hooks/useFetchRatings";
import { Address, zeroAddress } from "viem";
import { useAccount } from "wagmi";
import Image from "next/image";
import AddressBar from "@/components/Common/AddressBar";
import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { StyledButton } from "@/components/Styled/Button";
import { useUserInfo, useUserInfoDispatch } from "@/contexts/UserInfoContext";

const MinidenticonImg = ({ randomizer }: { randomizer: string }) => {
  const svgURI = useMemo(
    () =>
      "data:image/svg+xml;utf8," +
      encodeURIComponent(minidenticon(randomizer, "90")),
    [randomizer]
  );
  return <Image src={svgURI} alt={randomizer} width="40" height="40" />;
};

const LoggedInBar = () => {
  const { address } = useAccount();
  const {
    data: rawBalance,
    isError,
    isLoading,
  } = useBalance({
    address,
  });
  const [openDropdown, setOpenDropdown] = useState(false);
  const dispatch = useUserInfoDispatch();
  useEffect(() => {
    dispatch({
      type: "UPDATE_ADDRESS",
      payload: {
        address: address,
      },
    });
  }, [address, dispatch]);

  const userInfo = useUserInfo();

  const { rating: userRating } = useFetchRatings(address);
  useEffect(() => {
    dispatch({
      type: "UPDATE_RATING",
      payload: {
        rating: userRating,
      },
    });
  }, [userRating, dispatch]);

  const { logout, exportWallet } = usePrivy();
  const router = useRouter();

  let balance = "0.0000";
  if (!isError && !isLoading) {
    balance = Number(rawBalance?.formatted).toFixed(4);
  }

  const handleLogout = () => {
    logout();
    router.push(`/`);
  };

  const handleExport = () => {
    exportWallet();
  };

  return (
    <div className="flex flex-row space-x-2 items-center">
      <div className="flex">
        <div className="h-12 bg-white rounded-lg text-black flex items-center px-4">
          <Ribbon className="h-6 w-6" />
          {userRating}
          <EthIcon className="h-6 w-6 ml-2" /> {balance} ETH
        </div>
      </div>

      <div
        className="flex cursor-pointer bg-gray-100 rounded-full active:ring-4 active:ring-gray-300 duration-300"
        onClick={() => setOpenDropdown(!openDropdown)}
      >
        <MinidenticonImg randomizer={userInfo?.address || zeroAddress} />
        {openDropdown && (
          <div className="absolute top-16 right-1 w-72 bg-slate-600 rounded-lg m-2 flex flex-col items-start px-4">
            <div className="border-b w-full mt-3 mb-2">
              <AddressBar address={userInfo!.address} />
            </div>
            <Link href={`/profile/${address}`}>
              <div className="w-full my-2">
                <StyledButton>Profile</StyledButton>
              </div>
            </Link>
            <div className="w-full mb-5">
              <StyledButton onClick={handleLogout}>Log out</StyledButton>
            </div>
            <div className="w-full mb-5">
              <StyledButton onClick={handleExport}>Export wallet</StyledButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoggedInBar;

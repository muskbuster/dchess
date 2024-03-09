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
    <div className="flex flex-row space-x-2 items-center pixeloid-sans-bold">
      <div className="flex pr-3">
        <div className="h-12 bg-[#171F2E] rounded-[12px] flex items-center px-5 text-sm">
          <div className="pr-4 flex items-center">
            <img src="/icons/Medal.png" alt="" className="pr-2" />
            <span>{userRating}</span>
          </div>
          <div className="flex items-center">
            <img src="/icons/Eph.png" alt="" className="pr-2" />
            <span>{balance}</span>
          </div>
        </div>
      </div>

      <div
        className="flex cursor-pointer bg-[#171F2E] border-gray-700 p-1 border rounded-full active:ring-4 active:ring-gray-300 duration-300"
        onClick={() => setOpenDropdown(!openDropdown)}
      >
        <MinidenticonImg randomizer={userInfo?.address || zeroAddress} />
        {openDropdown && (
          <div className="absolute top-16 right-1 w-72 bg-[#171F2E] rounded-[12px] m-2 flex flex-col items-start px-5 pixeloid-sans">
            <div className="border-b w-full mt-3 mb-2 border-gray-700">
              <AddressBar address={userInfo?.address || zeroAddress} />
            </div>
            <Link href={`/profile/${address}`}>
              <div className="w-full mb-2">
                <span>Profile</span>
              </div>
            </Link>
            <div className="w-full mb-2 border-b pb-3 border-gray-700">
              <span onClick={handleLogout}>Log out</span>
            </div>
            <div className="w-full mb-5">
              <span onClick={handleExport}>Export wallet</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoggedInBar;

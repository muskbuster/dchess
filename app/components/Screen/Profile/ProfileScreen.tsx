"use client";
import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";

import { StyledButton } from "@/components/Styled/Button";
import { useAccount } from "wagmi";
import AddressBar from "@/components/Common/AddressBar";
import { useQuery } from "@apollo/client";
import { GET_USER_DATA, ALL_USERS } from "@/utils/graphQLQueries";
import NFTDeck from "./NFTDeck";
import { bigIntToOnes } from "@/utils/general";

const UserStats = ({
  userData,
}: {
  userData: null | {
    rating: bigint;
    totalSolved: BigInt;
    totalCreated: BigInt;
  };
}) => {
  return (
    <div>
      <div className="text-sm font-extralight">
        Rating: {userData ? bigIntToOnes(userData.rating) : 0}
      </div>
      <div className="text-sm font-extralight">
        Solves : {userData ? userData.totalCreated.toString() : 0}
      </div>
      <div className="text-sm font-extralight">
        Created : {userData ? userData.totalSolved.toString() : 0}
      </div>
    </div>
  );
};

const ProfileScreen = () => {
  const { address } = useAccount();
  const { authenticated, logout, exportWallet } = usePrivy();
  const router = useRouter();
  const result = useQuery(GET_USER_DATA, {
    variables: { userAddress: address },
  });

  const handleLogout = () => {
    logout();
    router.push(`/`);
  };

  const handleExport = () => {
    exportWallet();
  };

  return authenticated ? (
    <div className="flex flex-col space-y-5 mt-5">
      {address ? (
        <div>
          <div> Account</div>
          <AddressBar address={address as string} />
        </div>
      ) : (
        <></>
      )}
      {!result.loading ? (
        <div className="flex space-x-5">
          <UserStats userData={result.data.user} />
          <NFTDeck nfts={result.data.user.nftsOwned} />
        </div>
      ) : (
        <></>
      )}
      <StyledButton onClick={handleExport}>Export wallet</StyledButton>
      <StyledButton onClick={handleLogout}>Log out</StyledButton>
    </div>
  ) : (
    <></>
  );
};

export default ProfileScreen;

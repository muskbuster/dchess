"use client";
import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";

import { StyledButton } from "@/components/Layout/StyledButton";
import { useAccount } from "wagmi";
import AddressBar from "@/components/Common/AddressBar";
import { useQuery } from "@apollo/client";
import { GET_USER_DATA, ALL_USERS } from "@/utils/graphQLQueries";
const ZERO = BigInt(0);

const UserStats = ({
  userData,
}: {
  userData: null | {
    rating: BigInt;
    totalSolved: BigInt;
    totalCreated: BigInt;
  };
}) => {
  // const userData = userDataFromQuery
  //   ? userDataFromQuery
  //   : { rating: ZERO, solves: ZERO, created: ZERO };
  return (
    <div>
      <text> Rating: {userData ? userData.rating.toString() : 0} </text>
      <text> Solves : {userData ? userData.totalCreated.toString() : 0} </text>
      <text> Created : {userData ? userData.totalSolved.toString() : 0} </text>
    </div>
    // <table>
    //   <tr >
    //     <td>  : </td>
    //   </tr>
    // </table>
  );
};

const ProfileScreen = () => {
  const { address } = useAccount();
  const { authenticated, logout, exportWallet } = usePrivy();
  const router = useRouter();
  const result = useQuery(GET_USER_DATA, {
    variables: { userAddress: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266" },
  });

  const handleLogout = () => {
    logout();
    router.push(`/`);
  };

  const handleExport = () => {
    exportWallet();
  };

  console.log("result", result);

  return authenticated ? (
    <div className="flex flex-col space-y-5 mt-5">
      {address ? <AddressBar address={address as string} /> : <></>}
      <StyledButton onClick={handleExport}>Export wallet</StyledButton>
      {!result.loading ? <UserStats userData={result.data.user} /> : <></>}
      <StyledButton onClick={handleLogout}>Log out</StyledButton>
    </div>
  ) : (
    <></>
  );
};

export default ProfileScreen;

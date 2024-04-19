import Image from "next/image";
import Link from "next/link";

const abbreviateString = (str: string) => {
  if (!str) return "";
  else
    return str.length <= 10
      ? str
      : `${str.substring(0, 5)}...${str.substring(str.length - 4)}`;
};

export const CanonicalUsername = ({
  userData,
}: {
  userData: { farcaster: string; address: string; ens: string };
}) => {
  return userData.farcaster != null ? (
    <Link className="flex flex-row" href={`/profile/${userData.address}`}>
      <Image
        src="/farcaster-rounded.svg"
        width={20}
        height={20}
        alt="farcaster"
        className="mr-2"
      />
      {userData.farcaster}
    </Link>
  ) : userData.ens != null ? (
    <Link className="block" href={`/profile/${userData.address}`}>
      {userData.ens}
    </Link>
  ) : (
    <>
      <Link className="block sm:hidden" href={`/profile/${userData.address}`}>
        {abbreviateString(userData.address)}
      </Link>
      <Link className="hidden sm:block" href={`/profile/${userData.address}`}>
        {userData.address}
      </Link>
    </>
  );
};

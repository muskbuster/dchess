"use client";

import useFetchProfile from "@/hooks/useFetchProfile";
import Gallery from "@/components/Views/Profile/Gallery";
import Image from "next/image";
import Link from "next/link";

const ProfileStats = ({
  profile,
}: {
  profile: {
    ratings: number;
    totalSolved: number;
    totalAttempted: number;
    totalMinted: number;
    points: number;
    farcasterInfo: { username: string; displayName: string } | null;
  };
}) => {
  return (
    <div className="text-sm sm:text-base">
      {profile.farcasterInfo && (
        <div className="flex justify-between pb-5">
          <span>Farcaster:</span>
          <div className="flex flex-row justify-center">
            <Image
              src="/farcaster-rounded.svg"
              width={20}
              height={20}
              alt="farcaster"
              className="mr-2"
            />
            <Link
              href={`https://warpcast.com/${profile.farcasterInfo.username}`}
              target="_blank"
            >
              <span className="text-[#E6FA04]">
                {profile.farcasterInfo.displayName} (@
                {profile.farcasterInfo.username})
              </span>
            </Link>
          </div>
        </div>
      )}
      <div className="flex justify-between pb-3">
        <span>Rating:</span>
        <span className="text-[#E6FA04]">{profile.ratings}</span>
      </div>
      <div className="flex justify-between pb-3">
        <span>Attempted:</span>
        <span className="text-[#E6FA04]">{profile.totalAttempted}</span>
      </div>
      <div className="flex justify-between pb-3">
        <span>Solved:</span>
        <span className="text-[#E6FA04]">{profile.totalSolved}</span>
      </div>
      <div className="flex justify-between pb-3">
        <span>Minted:</span>
        <span className="text-[#E6FA04]">{profile.totalMinted}</span>
      </div>
      <div className="flex justify-between pb-3">
        <span>Points:</span>
        <span className="text-[#E6FA04]">{profile.points}</span>
      </div>
    </div>
  );
};

const ProfileScreen = ({
  loggedIn,
  address,
}: {
  loggedIn: boolean;
  address: string;
}) => {
  const { profile } = useFetchProfile(address);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 w-full justify-center gap-x-10 gap-y-4 grow pixeloid-sans sm:px-20">
      <div className="sm:col-span-1 flex flex-col sm:space-y-5 bg-[#010712] rounded-[16px] p-4 sm:p-10">
        <div className="text-base sm:text-xl mb-5 pixeloid-sans-bold">
          {" "}
          Account
        </div>
        <ProfileStats profile={profile} />
      </div>
      <div className="sm:col-span-2 flex flex-col sm:space-y-5 bg-[#010712] rounded-[16px] p-4 sm:p-10">
        <div className="text-base sm:text-xl mb-5 pixeloid-sans-bold">
          {" "}
          NFTs Owned
        </div>
        <Gallery ids={profile.nftsOwned} />
      </div>
    </div>
  );
};

export default ProfileScreen;

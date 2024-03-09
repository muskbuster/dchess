import { CopyIcon } from "@radix-ui/react-icons";

import base from "@/public/base.svg";
import { Manrope } from "next/font/google";
import { useState } from "react";
import { Address, isAddress } from "viem";
import Image from "next/image";
import { truncateAddress } from "@/utils/general";

const mono = Manrope({ subsets: ["latin"], weight: "400" });

const AddressBar = ({
  address,
  large = true,
  iconSize = 15,
}: {
  address: string;
  large?: boolean;
  iconSize?: number;
}) => {
  const truncatedAddress = truncateAddress(address as Address);

  return (
    <div className="flex flex-row space-x-2 items-center justify-between pb-2 w-full">
      {/* <Image src={base} alt="logo" height={iconSize} /> */}
      <div className={`text-white pixeloid-sans`}>
        {isAddress(address) ? truncatedAddress : address}
      </div>
      <CopyIcon
        height={iconSize}
        width={iconSize}
        className="text-white active:text-slate-400"
        onClick={() => {
          navigator.clipboard.writeText(address);
        }}
      />
    </div>
  );
};

export default AddressBar;

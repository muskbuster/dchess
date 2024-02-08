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
    <div className="flex flex-row rounded pb-2">
      <div className="flex flex-row space-x-2 items-center">
        {/* <Image src={base} alt="logo" height={iconSize} /> */}
        <div
          className={`text-white ${large ? "text-lg" : "text-xs"} ${
            mono.className
          }`}
        >
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
    </div>
  );
};

export default AddressBar;

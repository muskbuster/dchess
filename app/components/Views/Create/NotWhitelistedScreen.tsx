import { truncateAddress } from "@/utils/general";
import { Address, zeroAddress } from "viem";

export const NotWhitelistedScreen = ({ address }: { address: string }) => {
  const copy =
    zeroAddress != address
      ? `Address ${truncateAddress(
          address as Address
        )} is not whitelisted as a creator`
      : "";
  const copy2 = `We are selectively onboarding \
at the moment so we can filter for quality. If you believe you'd be a useful member to the \
community. Please fill out the request below and we will get back to you soon!`;
  return (
    <div className="flex flex-row w-full justify-center mt-20">
      <div className="w-1/3 text-md text-center">
        <div>{copy}</div>
        <div className="mt-10 text-sm mb-10">{copy2}</div>
        <div className="flex items-center justify-center">
          <a
            href="https://forms.gle/Yy3WNLvcXcmieA1r6"
            target="_blank"
            className=" underline"
          >
            https://forms.gle/Yy3WNLvcXcmieA1r6
          </a>
        </div>
      </div>
    </div>
  );
};

import { truncateAddress } from "@/utils/general";
import { Address } from "viem";

export const NotWhitelistedScreen = ({ address }: { address: string }) => {
  const copy = `Address ${truncateAddress(
    address as Address
  )} is not whitelisted as a creator`;
  const copy2 = `We are selectively onboarding \
at the moment so we can filter for quality. If you believe you'd be a useful member to the \
community. Please fill out the request below and we will get back to you soon!`;
  return (
    <div className="flex flex-row w-full justify-center mt-20">
      <div className="w-1/3 text-md text-center">
        <div>{copy}</div>
        <div className="mt-10 text-sm mb-10">{copy2}</div>
        <div className="flex items-center justify-center">
          <iframe
            src="https://docs.google.com/forms/d/e/1FAIpQLSfTLQzscc3T5ryyCt468L5pqbRlrRnIjWR5MnWXaHqrI5QMhg/viewform?embedded=true"
            width="640"
            height="1261"
          >
            Loading…
          </iframe>
        </div>
      </div>
    </div>
  );
};

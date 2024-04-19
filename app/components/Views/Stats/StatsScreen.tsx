import { ConnectedWallet } from "@privy-io/react-auth";
import "./StatsScreen.css";
import { RatingsTable } from "./RatingsTable";
import { EarningsTable } from "./EarningsTable";
import { PointsTable } from "./PointsTable";

const StatsScreen = ({
  activeWallet,
}: {
  activeWallet: ConnectedWallet | undefined;
}) => {
  return (
    <div
      role="tablist"
      className="tabs tabs-lifted sm:mx-10 pt-2 sm:pt-0 pixeloid-sans"
    >
      <input
        type="radio"
        name="my_tabs_2"
        role="tab"
        className="tab [--tab-bg:#E6FA04] [--tab-border-color:#E6FA04] pixeloid-sans-bold text-xs sm:text-lg"
        aria-label="Most Points"
        defaultChecked
      />
      <div
        role="tabpanel"
        className="tab-content overflow-x-scroll bg-[#000000E5] border-none rounded-box p-1 sm:p-6"
      >
        <div className="overflow-x-auto">
          <PointsTable activeWallet={activeWallet} />
        </div>
      </div>

      <input
        type="radio"
        name="my_tabs_2"
        role="tab"
        className="tab [--tab-bg:#E6FA04] [--tab-border-color:#E6FA04] pixeloid-sans-bold text-xs sm:text-lg"
        aria-label="Highest Ratings"
      />
      <div
        role="tabpanel"
        className="tab-content overflow-x-scroll bg-[#000000E5] border-none rounded-box p-1 sm:p-6"
      >
        <div className="overflow-x-auto">
          <RatingsTable activeWallet={activeWallet} />
        </div>
      </div>

      <input
        type="radio"
        name="my_tabs_2"
        role="tab"
        className="tab [--tab-bg:#E6FA04] [--tab-border-color:#E6FA04] pixeloid-sans-bold text-xs sm:text-lg"
        aria-label="Top Earners"
      />
      <div
        role="tabpanel"
        className="tab-content overflow-x-scroll bg-[#000000E5] border-none rounded-box p-1 sm:p-6"
      >
        <div className="overflow-x-auto">
          <EarningsTable activeWallet={activeWallet} />
        </div>
      </div>
    </div>
  );
};

export default StatsScreen;

import useFetchPuzzleList from "@/hooks/useFetchPuzzleList";
import useFetchPuzzleListNoWallet from "@/hooks/useFetchPuzzleListNoWallet";
import { ConnectedWallet } from "@privy-io/react-auth";
import Link from "next/link";
import { FaStar } from "react-icons/fa";

const DrawerComponentWallet = ({
  activeWallet,
  puzzleId,
  toggleDrawer,
}: {
  activeWallet: ConnectedWallet;
  puzzleId: number;
  toggleDrawer: any;
}) => {
  const { puzzles } = useFetchPuzzleList(activeWallet);
  return (
    <div className="absolute inset-0 overflow-y-scroll bg-[#010712] rounded-[16px]">
      <div className="sticky top-0 bg-[#010712]">
        <div className="pixeloid-sans-bold text-lg pt-6 pb-2 px-5 flex items-center">
          <img src="/icons/AngleLeft.png" alt="" onClick={toggleDrawer} className="pr-2 h-6 sm:hidden"/>
          List Of Puzzles
        </div>
        <div className="border-t border-[#596174] mx-2"></div>
        <div className="flex justify-between text-sm px-6 pt-2 pb-2 text-[#596172]">
          <span>Name</span>
          <span>Success</span>
        </div>
      </div>
      <div className="w-full pixeloid-sans px-3">
        <ul className="">
          {puzzles.map((p: any, idx: number) => (
            <li
              key={idx}
              className={`flex px-4 py-2.5 rounded-[12px] items-center ${
                p.puzzle_id == puzzleId ? "bg-[#171F2E]" : ""
              }`}
            >
              <div className="flex items-center">
                {p.solved ? (
                  <img src="/icons/Check.png" className="pr-3 h-4" />
                ) : p.failed ? (
                  <img src="/icons/Close.png" className="pr-3 h-4" />
                ) : (
                  ""
                )}
              </div>
              {p.minted ? (
                <FaStar className="text-yellow-300 mr-3 h-4" />
              ) : (
                ""
              )}
              <Link href={`/play/${p.puzzle_id}`}>
                Puzzle #{p.puzzle_id + 1}
              </Link>
              <div className="grow"></div>
              <div className="text-[#E6FA04]">{`${p.success_rate}%`}</div>
            </li>
          ))}
          <li></li>
        </ul>
      </div>
    </div>
  );
};

const DrawerComponentNoWallet = ({ puzzleId, toggleDrawer }: { puzzleId: number, toggleDrawer: any }) => {
  const { puzzles } = useFetchPuzzleListNoWallet();
  return (
    <div className="absolute inset-0 overflow-y-scroll bg-[#010712] rounded-[16px]">
      <div className="sticky top-0 bg-[#010712]">
        <div className="pixeloid-sans-bold text-lg pt-6 pb-2 px-5 flex items-center">
          <img src="/icons/AngleLeft.png" alt="" onClick={toggleDrawer} className="pr-2 h-6 sm:hidden"/>
          List Of Puzzles
        </div>
        <div className="border-t border-[#596174] mx-2"></div>
        <div className="flex justify-between text-sm px-6 pt-2 pb-2 text-[#596172]">
          <span>Name</span>
          <span>Success</span>
        </div>
      </div>
      <div className="w-full pixeloid-sans px-3">
        <ul className="">
          {puzzles.map((p: any, idx: number) => (
            <li
              key={idx}
              className={`flex px-4 py-2.5 rounded-[12px] ${
                p.puzzle_id == puzzleId ? "bg-[#171F2E]" : ""
              }`}
            >
              <div className="flex items-center">
                {p.solved ? (
                  <img src="/icons/Check.png" className="pr-3 h-4" />
                ) : p.failed ? (
                  <img src="/icons/Close.png" className="pr-3 h-4" />
                ) : (
                  ""
                )}
              </div>
              <Link href={`/play/${p.puzzle_id}`}>
                Puzzle #{p.puzzle_id + 1}
              </Link>
              <div className="grow"></div>
              <div className="text-[#E6FA04]">{`${p.success_rate}%`}</div>
            </li>
          ))}
          <li></li>
        </ul>
      </div>
    </div>
  );
};

export const DrawerComponent = ({
  activeWallet,
  puzzleId,
  isDrawerOpen,
  toggleDrawer,
}: {
  activeWallet: ConnectedWallet | undefined;
  puzzleId: number;
  isDrawerOpen: boolean;
  toggleDrawer: any;
}) => {
  const wallet = activeWallet ? 
    <DrawerComponentWallet activeWallet={activeWallet} puzzleId={puzzleId} toggleDrawer={toggleDrawer} /> :
    <DrawerComponentNoWallet puzzleId={puzzleId} toggleDrawer={toggleDrawer} />;
  return (
    <>
      {/* mobile */}
      <div className={`fixed left-0 top-0 bottom-0 right-0 z-[1000] block sm:hidden transition-transform duration-300 ${isDrawerOpen ? '' : '-translate-x-full'}`}>
        {wallet}
      </div>
      {/* desktop */}
      <div className="hidden sm:block relative">
        {wallet}
      </div>
    </>
  );
};

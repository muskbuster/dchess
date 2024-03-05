import useFetchPuzzleList from "@/hooks/useFetchPuzzleList";
import useFetchPuzzleListNoWallet from "@/hooks/useFetchPuzzleListNoWallet";
import { ConnectedWallet } from "@privy-io/react-auth";
import Link from "next/link";

const DrawerComponentWallet = ({ activeWallet, puzzleId }: { activeWallet: ConnectedWallet | undefined; puzzleId: number }) => {
  const { puzzles } = activeWallet ? 
    useFetchPuzzleList(activeWallet) : 
    useFetchPuzzleListNoWallet();
  return (
    <div className="relative">
      <div className="absolute inset-0 overflow-y-scroll bg-[#010712] rounded-[16px]">
        <div className="sticky top-0 bg-[#010712]">
          <div className="pixeloid-sans-bold text-lg pt-6 pb-2 px-5">List Of Puzzles</div>
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
                  className={`flex px-4 py-2.5 rounded-[12px] ${p.puzzle_id == puzzleId ? "bg-[#171F2E]" : ""}`}
                >
                  <div className="flex items-center">
                    {p.solved ? (<img src="/icons/Check.png" className="pr-3 h-4"/>) : p.failed ? (<img src="/icons/Close.png" className="pr-3 h-4"/>) : ""}
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
    </div>
  );
};

export const DrawerComponent = ({
  activeWallet,
  puzzleId,
}: {
  activeWallet: ConnectedWallet | undefined;
  puzzleId: number;
}) => {
  return <DrawerComponentWallet activeWallet={activeWallet} puzzleId={puzzleId} />
};

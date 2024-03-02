import useFetchPuzzleList from "@/hooks/useFetchPuzzleList";
import useFetchPuzzleListNoWallet from "@/hooks/useFetchPuzzleListNoWallet";
import { ConnectedWallet } from "@privy-io/react-auth";
import Link from "next/link";

const DrawerComponentNoWallet = ({ puzzleId }: { puzzleId: number }) => {
  const { puzzles } = useFetchPuzzleListNoWallet();
  return (
    <div className="max-h-[80vh] overflow-y-scroll w-96 bg-[#010712] rounded-[16px]">
      <div className="pixeloid-sans-bold text-lg pt-6 pb-2 px-5">List Of Puzzles</div>
      <div className="border-t border-[#596174] mx-2"></div>
      <div className="w-full pixeloid-sans px-3">
        <div className="flex justify-between text-sm px-3 pt-2 pb-2 text-[#596172]">
          <span>Name</span>
          <span>Success</span>
        </div>
        <ul className="">
          {puzzles.map((p: any, idx: number) => (
              <li
                key={idx}
                className={`flex justify-between px-4 py-2.5 rounded-[12px] ${p.puzzle_id == puzzleId ? "bg-[#171F2E]" : ""}`}
              >
                <Link href={`/play/${p.puzzle_id}`}>
                  Puzzle #{p.puzzle_id + 1}
                </Link>
                <div className=""></div>
                <div className="text-[#E6FA04]">{`${p.success_rate}%`}</div>
              </li>
            ))}
          <li></li>
        </ul>
      </div>
    </div>
  );
};

const DrawerComponentWallet = ({
  activeWallet,
  puzzleId,
}: {
  activeWallet: ConnectedWallet;
  puzzleId: number;
}) => {
  const { puzzles } = useFetchPuzzleList(activeWallet);
  return (
    <div className="fixed top-0 left-0 w-80 bg-slate-500 h-screen pt-20 overflow-scroll pb-16 px-2">
      <div className="w-full">
        <table className="table-fixed w-full">
          <tbody>
            {puzzles.map((p: any, idx: number) => (
              <tr key={idx}>
                <td
                  className={`w-3/5 pl-2 ${
                    p.puzzle_id == puzzleId
                      ? "opacity-100 font-bold"
                      : "opacity-70"
                  }`}
                >
                  <Link href={`/play/${p.puzzle_id}`}>
                    Puzzle #{p.puzzle_id + 1}
                  </Link>
                </td>
                <td className="w-1/5 text-right">
                  {p.solved ? "✅" : p.failed ? "❌" : ""}
                </td>
                <td
                  className={`w-1/5 text-right pr-2 ${
                    p.puzzle_id == puzzleId
                      ? "opacity-100 font-bold"
                      : "opacity-70"
                  }`}
                >{`${p.success_rate}%`}</td>
              </tr>
            ))}
          </tbody>
        </table>
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
  return activeWallet ? (
    <DrawerComponentWallet activeWallet={activeWallet} puzzleId={puzzleId} />
  ) : (
    <DrawerComponentNoWallet puzzleId={puzzleId} />
  );
};

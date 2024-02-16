import useFetchPuzzleList from "@/hooks/useFetchPuzzleList";
import { ConnectedWallet } from "@privy-io/react-auth";
import Link from "next/link";

export const DrawerComponent = ({
  activeWallet,
}: {
  activeWallet: ConnectedWallet | undefined;
}) => {
  const { puzzles } = useFetchPuzzleList(activeWallet);
  return (
    <div className="fixed top-0 left-0 w-80 bg-slate-500 h-screen pt-20">
      <div className="w-full">
        <table className="table-fixed w-full">
          <tbody>
            {puzzles.map((p: any, idx: number) => (
              <tr key={idx}>
                <td className="w-1/2 pl-2">
                  <Link href={`/play/${p.puzzle_id}`}>
                    Puzzle #{p.puzzle_id + 1}
                  </Link>
                </td>
                <td className="w-1/4 text-right">
                  {p.solved ? "✅" : p.failed ? "❌" : ""}
                </td>
                <td className="w-1/4 text-right pr-2">{`${p.success_rate}%`}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

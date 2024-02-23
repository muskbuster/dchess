import useFetchPuzzleList from "@/hooks/useFetchPuzzleList";
import useFetchPuzzleListNoWallet from "@/hooks/useFetchPuzzleListNoWallet";
import React, { useState } from 'react';
import { HiMenu, HiX } from 'react-icons/hi'; // Import icons from HeroIcons
import { ConnectedWallet } from "@privy-io/react-auth";
import Link from "next/link";

const DrawerComponentNoWallet = () => {
  const { puzzles } = useFetchPuzzleListNoWallet();
  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <button className="fixed top-0 left-0 z-[8]  bg-gray-800 text-white px-3 py-2 md:hidden block"
        onClick={toggleDrawer}>
        {isOpen ? <HiX size={20} /> : <HiMenu size={20} />} {/* Toggle Icon */}
      </button>
      <div className={`fixed top-0 left-0 sm:w-80 my-w-full z-[7] bg-slate-500 h-screen pt-20  pt-[7rem] md:block
        ${isOpen ? 'block' : 'hidden'}`}>
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
                  <td className="w-1/4 text-right"></td>
                  <td className="w-1/4 text-right pr-2">{`${p.success_rate}%`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};


const DrawerComponentWallet = ({
  activeWallet,
}: {
  activeWallet: ConnectedWallet;
}) => {
  const { puzzles } = useFetchPuzzleList(activeWallet);
  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <button className="fixed top-[70px] left-0 z-[8] bg-gray-800 text-white px-3 py-2 md:hidden block"
        onClick={toggleDrawer}>
        {isOpen ? <HiX size={20} /> : <HiMenu size={20} />} {/* Toggle Icon */}
      </button>
      <div className={`fixed top-0 left-0 sm:w-80 my-w-full z-[7] bg-slate-500 h-screen md:pt-20 pt-[7rem] md:block 
        ${isOpen ? 'block' : 'hidden'}`}>
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
    </div>
  );
};

export const DrawerComponent = ({
  activeWallet,
}: {
  activeWallet: ConnectedWallet | undefined;
}) => {
  return activeWallet ? (
    <DrawerComponentWallet activeWallet={activeWallet} />
  ) : (
    <DrawerComponentNoWallet />
  );
};

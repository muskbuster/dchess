// @ts-ignore
import { NextChessground } from "next-chessground";
import { useRef } from "react";

export const BoardAreaComponent = ({
  successfulSolved,
  fetchPuzzlesLoading,
  attempts,
  fen,
  onMove,
  viewOnly,
  loggedIn,
}: {
  successfulSolved: any;
  fetchPuzzlesLoading: any;
  attempts: any;
  fen: any;
  onMove: any;
  viewOnly: any;
  loggedIn: boolean;
}) => {
  const ref = useRef();

  return (
    <div className={`col-span-1 sm:col-span-2 flex ${!loggedIn ? "brightness-50" : ""}`}>
      <div className="grow max-w-[42rem]">
        <NextChessground
          key={attempts}
          ref={ref}
          fen={fen}
          onMove={onMove}
          viewOnly={viewOnly}
        />
      </div>
    </div>
  );
};

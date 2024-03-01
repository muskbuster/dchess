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
}: {
  successfulSolved: any;
  fetchPuzzlesLoading: any;
  attempts: any;
  fen: any;
  onMove: any;
  viewOnly: any;
}) => {
  const ref = useRef();

  return (
    <div className="w-1/3 flex flex-col items-center space-y-5 min-w-[400px]">
      <NextChessground
        key={attempts}
        ref={ref}
        fen={fen}
        onMove={onMove}
        viewOnly={viewOnly}
      />
    </div>
  );
};

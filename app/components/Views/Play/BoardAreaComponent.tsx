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
    <div className="col-span-2 flex">
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

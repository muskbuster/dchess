// @ts-ignore
import { NextChessground } from "next-chessground";
import { useRef } from "react";
import { FaArrowRotateLeft } from "react-icons/fa6";

export const BoardAreaComponent = ({
  flipImage,
  successfulSolved,
  showMintImage,
  fetchPuzzlesLoading,
  attempts,
  fen,
  onMove,
  viewOnly,
}: {
  flipImage: any;
  successfulSolved: any;
  showMintImage: any;
  fetchPuzzlesLoading: any;
  attempts: any;
  fen: any;
  onMove: any;
  viewOnly: any;
}) => {
  const ref = useRef();

  return (
    <div className="w-1/3 flex flex-col items-center space-y-5">
      <FaArrowRotateLeft
        size={30}
        onClick={flipImage}
        className={`${!successfulSolved ? "opacity-5" : "cursor-pointer"}`}
      />
      {showMintImage ? (
        fetchPuzzlesLoading ? (
          <div>...loading</div>
        ) : (
          <div></div>
          // <NFTVisual uri={puzzles.data.puzzles[puzzleId - 1].uri} />
        )
      ) : (
        <NextChessground
          key={attempts}
          ref={ref}
          fen={fen}
          onMove={onMove}
          viewOnly={viewOnly}
        />
      )}
    </div>
  );
};

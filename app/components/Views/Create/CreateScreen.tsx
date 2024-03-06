// @ts-ignore
import { NextEditor, NextChessground, Stockfish } from "next-chessground";
import { Chess } from "chess.js";
import { useEffect, useRef, useState } from "react";

import { StyledButton } from "@/components/Styled/Button";
import { FaUndo } from "react-icons/fa";

import "./CreateScreen.css";
import useAddPuzzle from "@/hooks/useAddPuzzle";
import { ConnectedWallet } from "@privy-io/react-auth";
import { zeroAddress } from "viem";
import useStockfishVerification from "@/hooks/useStockfishVerification";

enum CreateState {
  Problem,
  Solution,
}

const CreateScreen = ({
  activeWallet,
}: {
  activeWallet: ConnectedWallet | undefined;
}) => {
  const emptyFen = "8/8/8/8/8/8/8/8 w - - 0 1";

  const [description, setDescription] = useState("");
  const [fen, setFen] = useState(emptyFen);
  const [createState, setCreateState] = useState(CreateState.Problem);
  const [winningMove, setWinningMove] = useState("--");
  const [viewOnly, setViewOnly] = useState(false);
  const [validGame, setValidGame] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [stockfishVerifying, setStockfishVerifying] = useState(false);

  const { write: writePuzzle, isSuccess: isSubmitPuzzleSuccess } = useAddPuzzle(
    fen,
    winningMove,
    description,
    activeWallet
  );

  const {
    refetch: verifyStockfish,
    isStockfishVerificationSuccess,
    isStockfishVerificationFailed,
  } = useStockfishVerification(fen, winningMove);

  useEffect(() => {
    if (isSubmitPuzzleSuccess) {
      alert("Puzzle successful submitted!");
      // TODO: replace with getting status
      window.location.reload();
    }
  }, [isSubmitPuzzleSuccess]);

  useEffect(() => {
    if (winningMove == "--") {
      setStockfishVerifying(false);
      return;
    }

    setStockfishVerifying(true);
    // trigger verification
    verifyStockfish();
  }, [winningMove, verifyStockfish]);

  const ref = useRef();

  const handleSelect = (fen: any) => {
    setFen(fen);
    try {
      const chess = new Chess(fen);
      if (!chess.isGameOver()) setValidGame(true);
    } catch (e) {
      setValidGame(false);
    }
  };

  async function handleSubmit() {
    if (createState == CreateState.Solution) {
      if (isStockfishVerificationSuccess) writePuzzle?.();
    }
  }

  const handleNext = () => {
    if (createState == CreateState.Problem) {
      setCreateState(CreateState.Solution);
    }
  };

  function handleDescriptionChange(e: any) {
    setDescription(e.target.value);
  }

  const undoMove = () => {
    setWinningMove("--");
    setAttempts(attempts + 1);
    setViewOnly(false);
  };

  const onMove = async (chess: any) => {
    setWinningMove(chess.history()[0]);
    setViewOnly(true);
  };

  const placeholderDescription = `For example: White to play. Mate in 3 moves!\n\n\Warning: misleading descriptions can lead to a ban!`;

  const tooltip = `80% of the proceeds from mint of this puzzle will go to the creator`;
  return (
    <div className="flex flex-row justify-center">
      {createState == CreateState.Problem ? (
        <div className="w-1/3 px-12 rounded-md pixeloid-sans">
          <NextEditor ref={ref} onSelect={handleSelect} />
        </div>
      ) : (
        <div className="w-1/3">
          <NextChessground
            fen={fen}
            key={attempts}
            onMove={onMove}
            viewOnly={viewOnly}
          />
        </div>
      )}

      <div className="ml-8 w-1/3 flex flex-col justify-center bg-[#010712] rounded-[16px] p-8 pixeloid-sans">
        <div className="text-xl font-bold mt-10 mb-2">Description</div>
        <div className="text-sm mb-3">You can leave hints here or keep it mysterious.</div>
        <textarea
          className="mb-3 input input-bordered h-32 w-full p-2 bg-[#171F2E] rounded-[16px] disabled:bg-slate-200 disabled:text-slate-700 disabled:border-slate-300 text-sm rounded-md"
          value={description}
          onChange={handleDescriptionChange}
          disabled={createState !== CreateState.Problem}
          placeholder={placeholderDescription}
        />
        <div className="text-sm text-[#596172] mb-3">Warning: misleading descriptions can lead to a ban!</div>
        {createState == CreateState.Solution ? (
          <div className="flex flex-row items-start mt-2 justify-center text-[#E6FA04]">
            <div className="font-light mb-5 text-lg mr-5">{`Winning move: ${winningMove}`}</div>
            {winningMove != "--" ? (
              <FaUndo className="cursor-pointer" size={15} onClick={undoMove} />
            ) : (
              <></>
            )}
          </div>
        ) : (
          <></>
        )}
        {createState == CreateState.Problem ? (
          <StyledButton
            className="w-full"
            disabled={!validGame || description == ""}
            onClick={handleNext}
          >
            Next
          </StyledButton>
        ) : (
          <StyledButton
            className="w-full"
            disabled={winningMove == "--" || !isStockfishVerificationSuccess}
            onClick={handleSubmit}
          >
            Submit
          </StyledButton>
        )}
        <div className="flex items-center pt-4">
          <img src="/icons/Exclaim.png" alt="" className="mr-3"/>
          <div className="text-sm font-extralight">{tooltip}</div>
        </div>
        <div className="text-sm font-light mt-2 text-success">
        {winningMove != "--"
            ? isStockfishVerificationSuccess
              ? "Solution verified by Stockfish!"
              : isStockfishVerificationFailed
              ? "Solution is not correct according to Stockfish, try a different move!"
              : stockfishVerifying
              ? "Solution is being verified by Stockfish!"
              : ""
            : ""}
        </div>
      </div>
    </div>
  );
};

export default CreateScreen;

// @ts-ignore
import { NextEditor, NextChessground, Stockfish } from "next-chessground";
import { Chess } from "chess.js";
import { useEffect, useRef, useState } from "react";

import { StyledButton } from "@/components/Styled/Button";
import { FaUndo } from "react-icons/fa";

import "./CreateScreen.css";
import useAddPuzzle from "@/hooks/useAddPuzzle";
import { ConnectedWallet } from "@privy-io/react-auth";
import { whitelistedCreator } from "@/utils/general";
import { NotWhitelistedScreen } from "./NotWhitelistedScreen";
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

  const whitelisted =
    !!activeWallet && whitelistedCreator(activeWallet.address);

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

  const placeholderDescription = `You can leave hints here or keep it mysterious. \
For example: White to play. Mate in 3 moves!\n\n\
Warning: misleading descriptions can lead to a ban!`;

  const tooltip = `80% of the proceeds from mint of this puzzle will go to the creator`;
  return !whitelisted ? (
    <NotWhitelistedScreen
      address={activeWallet ? activeWallet.address : zeroAddress}
    />
  ) : (
    <div className="flex flex-row justify-center">
      {createState == CreateState.Problem ? (
        <div className="w-1/3 text-white px-12 rounded-md">
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

      <div className="ml-20 w-1/3 flex flex-col">
        <div className="text-sm font-extralight">{tooltip}</div>
        <div className="text-xl font-bold mt-10 mb-5">Description</div>
        <textarea
          className="input input-bordered h-32 max-w-96 text-black p-2 bg-slate-50 disabled:bg-slate-200 disabled:text-slate-700 disabled:border-slate-300 text-sm rounded-md"
          value={description}
          onChange={handleDescriptionChange}
          disabled={createState !== CreateState.Problem}
          placeholder={placeholderDescription}
        />
        {createState == CreateState.Solution ? (
          <div className="flex flex-row items-start mt-5">
            <div className="font-light mb-5 text-sm mr-5">{`winning move: ${winningMove}`}</div>
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
            className="w-32 mt-10"
            disabled={!validGame || description == ""}
            onClick={handleNext}
          >
            Next
          </StyledButton>
        ) : (
          <StyledButton
            className="w-32 mt-10"
            disabled={winningMove == "--" || !isStockfishVerificationSuccess}
            onClick={handleSubmit}
          >
            Submit
          </StyledButton>
        )}
        <div className="text-sm font-light mt-2">
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

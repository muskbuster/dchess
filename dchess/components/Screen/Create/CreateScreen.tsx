// prettier-ignore
// @ts-ignore
import { NextEditor, NextChessground, Stockfish } from "next-chessground";
import { Chess, SQUARES } from "chess.js";
import { useEffect, useRef, useState } from "react";

import { StyledButton } from "@/components/Layout/StyledButton";
import { FaUndo } from "react-icons/fa";
import { hashed } from "@/utils/general";
import { FENToBoard } from "@/utils/fiveOutOfNineArt";
import { useContractWrite, useWaitForTransaction } from "wagmi";
import { BOARD_ADDRESS } from "@/utils/addresses";
import { BoardAbi } from "@/utils/abis/Board";

enum CreateState {
  Problem,
  Solution,
}

const CreateScreen = () => {
  const emptyFen = "8/8/8/8/8/8/8/8 w - - 0 1";

  const ref = useRef();
  const [description, setDescription] = useState("");
  const [fen, setFen] = useState("8/8/8/8/8/8/8/8 w - - 0 1");
  const [createState, setCreateState] = useState(CreateState.Problem);
  const [winningMove, setWinningMove] = useState("--");
  const [viewOnly, setViewOnly] = useState(false);
  const [validGame, setValidGame] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(true);
  const [attempts, setAttempts] = useState(0);

  const handleSelect = (fen: any) => {
    setFen(fen);
    try {
      const chess = new Chess(fen);
      if (!chess.isGameOver()) setValidGame(true);
    } catch (e) {
      setValidGame(false);
    }
  };

  const { data, write, isError, isSuccess } = useContractWrite({
    address: BOARD_ADDRESS,
    abi: BoardAbi,
    functionName: "addPuzzle",
    chainId: 31337,
  });

  const waitForTx = useWaitForTransaction({
    hash: data?.hash,
  });

  useEffect(() => {
    if (waitForTx.isSuccess && waitForTx.data?.logs.length === 1) {
      setSubmitSuccess(true);
    }
  }, [waitForTx]);

  async function handleSubmit(e: any) {
    e.preventDefault();

    if (winningMove == "--") {
      // User needs to set winning move
      setCreateState(CreateState.Solution);
    } else {
      // Actually submit to chain
      const solutionHash = hashed(winningMove);
      const board = FENToBoard(fen);
      console.log("fen", fen);
      console.log("solution hash", solutionHash);
      console.log("board", board);

      if (write) {
        ("writing");
        write({
          args: [fen, solutionHash, board],
        });
      }
    }
  }

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

  const placeholderDescription = `Black just played Qe2, which is a big mistake. White to play and win. I didn't find the move and ended up loosing badly. Can you find it?`;
  const tooltip = `80% of the proceeds from mint of this puzzle will go to the creator`;

  return (
    <div className="mt-20 flex flex-row justify-center">
      {createState == CreateState.Problem ? (
        <div className="w-96 text-black p-5 rounded-md bg-slate-50">
          <NextEditor ref={ref} onSelect={handleSelect} />
        </div>
      ) : (
        <div className="w-96">
          <NextChessground
            fen={fen}
            key={attempts}
            onMove={onMove}
            viewOnly={viewOnly}
          />
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="ml-20 w-96 flex flex-col justify-between"
      >
        <div className="flex flex-col space-y-5">
          <div className="text-sm font-extralight">{tooltip}</div>
          <div className="text-xl font-bold">Description</div>
          <textarea
            className="input input-bordered h-32 text-white p-2 bg-slate-500 disabled:bg-slate-700 disabled:text-slate-500 disabled:border-slate-800 text-sm rounded-md"
            value={description}
            onChange={handleDescriptionChange}
            disabled={createState !== CreateState.Problem}
            placeholder={placeholderDescription}
          />
          {createState == CreateState.Solution ? (
            <div className="flex flex-row space-x-2 items-start">
              <div className="font-light mb-5 text-sm">{`winning move: ${winningMove}`}</div>
              <FaUndo size={15} onClick={undoMove} />
            </div>
          ) : (
            <></>
          )}
        </div>
        <StyledButton
          className="w-32 mb-40"
          disabled={!validGame || description == ""}
        >
          Submit
        </StyledButton>
        {submitSuccess ? (
          <div className="text-sm font-light">
            Puzzle successfully submitted !{" "}
          </div>
        ) : (
          <></>
        )}
      </form>
    </div>
  );
};

export default CreateScreen;

import { useQuery } from "@tanstack/react-query";
import { Chess } from "chess.js";

async function stockfishVerify(fen: string) {
  return await fetch(`https://lichess.org/api/cloud-eval?fen=${fen}`).then(
    (res) => res.json()
  );
}

export default function useStockfishVerification(
  fen: string,
  winningMove: string
) {
  const { isError, isLoading, data, error, refetch } = useQuery({
    queryKey: ["stockfish-verify"],
    queryFn: () => stockfishVerify(fen),
    enabled: false,
    retry: true,
    retryDelay: (attempt) => attempt * 1000,
  });
  if (isError) console.log("lichess error: ", error);

  let isStockfishVerificationSuccess = false;
  let isStockfishVerificationFailed = false;
  if (!isError && !isLoading && winningMove != "--" && data) {
    // just taking the first one
    const bestMove = (data as any).pvs[0].moves.split(" ")[0];
    const chess = new Chess(fen);
    console.log(fen);
    chess.move(bestMove);
    const actualMove = chess.history()[0];
    if (winningMove == actualMove) {
      isStockfishVerificationSuccess = true;
    } else {
      isStockfishVerificationFailed = true;
    }
  }
  console.log("Stockfish response: ", data);

  return {
    isStockfishVerificationSuccess,
    isStockfishVerificationFailed,
    refetch,
  };
}

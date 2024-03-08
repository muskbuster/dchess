import { useQuery } from "@tanstack/react-query";

async function chessApi(fen: string) {
  const data = {
    fen: fen,
    depth: 18,
    maxThinkingTime: 100,
  };
  const response = await fetch(` https://chess-api.com/v1`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  return response.json();
}

export default function useStockfishVerification(
  fen: string,
  winningMove: string
) {
  const { isError, isLoading, data, error, refetch } = useQuery({
    queryKey: ["stockfish-verify"],
    queryFn: () => chessApi(fen),
    enabled: false,
    retry: true,
    retryDelay: (attempt) => attempt * 1000,
  });
  if (isError) console.log("lichess error: ", error);

  let isStockfishVerificationSuccess = false;
  let isStockfishVerificationFailed = false;
  if (!isError && !isLoading && winningMove != "--" && data) {
    const actualMove = data["sans"];
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

/* 

LEVERAGING LICHESS PREAPPROVED DATABASE

async function stockfishVerify(fen: string) {
  const response = await fetch(`https://lichess.org/api/cloud-eval?fen=${fen}`);
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  return response.json();
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

*/

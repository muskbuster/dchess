import { useQuery, gql } from "@apollo/client";

export const GET_ALL_PUZZLES = gql`
  query {
    puzzleAddeds {
      internalTokenId
      fen
      description
      creator
    }
  }
`;

export default function useFetchPuzzles() {
  const { data, loading, error } = useQuery(GET_ALL_PUZZLES);

  let puzzles = [];
  let unsortedLst = [];
  if (!loading && !error) unsortedLst = data.puzzleAddeds;

  puzzles = [...unsortedLst].sort((p1: any, p2: any) => {
    const a = Number(p1.internalTokenId);
    const b = Number(p2.internalTokenId);
    if (a < b) {
      return -1;
    } else if (a === b) {
      return 0;
    } else {
      return 1;
    }
  });

  return { puzzles, loading, error };
}

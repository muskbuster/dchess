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
  if (!loading && !error) puzzles = data.puzzleAddeds;

  return { puzzles, loading, error };
}

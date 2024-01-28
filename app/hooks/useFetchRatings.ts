import { useQuery, gql } from "@apollo/client";
import { SINGLE_USER_RATING } from "@/utils/graphQLQueries";

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

export default function useFetchRatings(address: string) {
  const { data, loading, error } = useQuery(SINGLE_USER_RATING, {
    variables: { userAddress: address },
  });

  let puzzles = [];
  if (!loading && !error) puzzles = data.puzzleAddeds;

  return { puzzles, loading, error };
}

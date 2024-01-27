import { useQuery } from "@apollo/client";
import { ALL_PUZZLES } from "@/utils/graphQLQueries";

export default function useSubmitSolution() {
  const puzzles = useQuery(ALL_PUZZLES);
}

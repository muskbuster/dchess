import { gql } from "@apollo/client";

export const GET_USER_DATA = gql`
  query MyQuery($userAddress: String!) {
    user(id: $userAddress) {
      totalAttempted
      rating
      totalCreated
      totalSolved
    }
  }
`;

export const ALL_USERS = gql`
  query AllUsers {
    users {
      id
      rating
      totalAttempted
      totalCreated
      totalSolved
    }
  }
`;

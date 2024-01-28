import { gql } from "@apollo/client";

export const GET_USER_DATA = gql`
  query MyQuery($userAddress: String!) {
    user(id: $userAddress) {
      totalAttempted
      rating
      totalCreated
      totalSolved
      nftsOwned {
        uri
        id
      }
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

export const RANKED_USERS = gql`
  query UsersByRating {
    users(orderBy: "rating", orderDirection: "desc") {
      id
      rating
      totalSolved
      totalAttempted
    }
    creators: users(
      orderBy: "totalCreated"
      orderDirection: "desc"
      first: 10
      where: { totalCreated_gt: "0" }
    ) {
      id
      rating
      totalCreated
    }
  }
`;

export const SINGLE_USER_RATING = gql`
  query MyQuery($userAddress: String!) {
    user(id: $userAddress) {
      rating
    }
  }
`;

import { gql } from "@apollo/client";

export const GET_ME = gql`
  query GetMe {
    getMe {
      user {
        id
        tgId
        firstName
        lastName
        username
        isPremium
        languageCode
        photoUrl
        allowsWriteToPm
      }
    }
  }
`;

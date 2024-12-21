import {
  ApolloClient,
  ApolloLink,
  gql,
  InMemoryCache,
  NormalizedCacheObject,
  Observable,
  split,
} from "@apollo/client";
import { loadDevMessages, loadErrorMessages } from "@apollo/client/dev";
import { onError } from "@apollo/client/link/error";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";
import createUploadLink from "apollo-upload-client/createUploadLink.mjs";
import Cookies from "js-cookie";
import dotenv from "dotenv";
import { useUserStore } from "../store/userStore";

dotenv.config();

loadErrorMessages();
loadDevMessages();

async function refreshToken(client: ApolloClient<NormalizedCacheObject>) {
  try {
    const { data } = await client.mutate({
      mutation: gql`
        mutation RefreshToken {
          refreshToken
        }
      `,
    });

    const newAccessToken = data?.refreshToken;
    if (!newAccessToken) throw new Error("New access token not received");
    return `Bearer ${newAccessToken}`;
  } catch (error) {
    throw new Error("Error getting new access token");
  }
}

let retryCount = 0;
const maxRetry = 3;

const wsLink = new WebSocketLink({
  uri: `ws://localhost:3000/graphql`,
  options: {
    reconnect: true,
    connectionParams: () => {
      const token = Cookies.get("access_token");
      return {
        Authorization: token ? `Bearer ${token}` : null,
      };
    },
  },
});

const errorLink = onError(({ graphQLErrors, operation, forward }) => {
  for (const err of graphQLErrors!) {
    if (err.extensions!.code === "UNAUTHENTICATED" && retryCount < maxRetry) {
      retryCount++;
      return new Observable((observer) => {
        refreshToken(client)
          .then((token) => {
            operation.setContext((previousContext: any) => ({
              headers: {
                ...previousContext.headers,
                authorization: token,
              },
            }));
            const forward$ = forward(operation);
            forward$.subscribe(observer);
          })
          .catch((error) => observer.error(error));
      });
    }

    if (
      err.message === "Refresh token not found" ||
      err.message === "Invalid or expired refresh token"
    ) {
      useUserStore.setState({ authenticated: false });
    }
  }
});

const uploadLink = createUploadLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_SERVER_ENDPOINT,
  credentials: "include",
  headers: {
    "apollo-require-preflight": "true",
  },
});

const link = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  ApolloLink.from([errorLink, uploadLink])
);

export const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: link,
});

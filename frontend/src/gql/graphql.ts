/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type AuntificateResponse = {
  __typename?: 'AuntificateResponse';
  user?: Maybe<UserResponse>;
};

export type AuthenticateInput = {
  initDataRaw: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  authenticate: Scalars['Boolean']['output'];
  refreshToken: Scalars['String']['output'];
};


export type MutationAuthenticateArgs = {
  input: AuthenticateInput;
};

export type Query = {
  __typename?: 'Query';
  getMe: AuntificateResponse;
  hello: Scalars['String']['output'];
};

export type UserResponse = {
  __typename?: 'UserResponse';
  allowsWriteToPm: Scalars['Boolean']['output'];
  firstName: Scalars['String']['output'];
  id: Scalars['String']['output'];
  isPremium?: Maybe<Scalars['Boolean']['output']>;
  languageCode?: Maybe<Scalars['String']['output']>;
  lastName?: Maybe<Scalars['String']['output']>;
  photoUrl?: Maybe<Scalars['String']['output']>;
  tgId: Scalars['Float']['output'];
  username?: Maybe<Scalars['String']['output']>;
};

export type AuthenticateMutationVariables = Exact<{
  input: AuthenticateInput;
}>;


export type AuthenticateMutation = { __typename?: 'Mutation', authenticate: boolean };

export type GetMeQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMeQuery = { __typename?: 'Query', getMe: { __typename?: 'AuntificateResponse', user?: { __typename?: 'UserResponse', id: string, tgId: number, firstName: string, lastName?: string | null, username?: string | null, isPremium?: boolean | null, languageCode?: string | null, photoUrl?: string | null, allowsWriteToPm: boolean } | null } };


export const AuthenticateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Authenticate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AuthenticateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"authenticate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<AuthenticateMutation, AuthenticateMutationVariables>;
export const GetMeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMe"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getMe"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"tgId"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"isPremium"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"photoUrl"}},{"kind":"Field","name":{"kind":"Name","value":"allowsWriteToPm"}}]}}]}}]}}]} as unknown as DocumentNode<GetMeQuery, GetMeQueryVariables>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type AuntificateResponse = {
  __typename?: 'AuntificateResponse';
  user?: Maybe<UserResponse>;
};

export type AuthenticateInput = {
  initDataRaw: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  authenticate: Scalars['Boolean']['output'];
  refreshToken: Scalars['String']['output'];
};


export type MutationAuthenticateArgs = {
  input: AuthenticateInput;
};

export type Query = {
  __typename?: 'Query';
  getMe: AuntificateResponse;
  hello: Scalars['String']['output'];
};

export type UserResponse = {
  __typename?: 'UserResponse';
  allowsWriteToPm: Scalars['Boolean']['output'];
  firstName: Scalars['String']['output'];
  id: Scalars['String']['output'];
  isPremium?: Maybe<Scalars['Boolean']['output']>;
  languageCode?: Maybe<Scalars['String']['output']>;
  lastName?: Maybe<Scalars['String']['output']>;
  photoUrl?: Maybe<Scalars['String']['output']>;
  tgId: Scalars['Float']['output'];
  username?: Maybe<Scalars['String']['output']>;
};

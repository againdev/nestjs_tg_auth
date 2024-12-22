"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import {
  AuthenticateMutation,
  AuthenticateMutationVariables,
  GetMeQuery,
  GetMeQueryVariables,
} from "@/src/gql/graphql";
import { AUTHENTICATE } from "@/src/graphql/mutations/Authenticate";
import { GET_ME } from "@/src/graphql/queries/GetMe";
import { useUserStore } from "../store/userStore";

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [initData, setInitData] = useState<string | null>(null);
  const [
    authenticate,
    { loading: authLoading, error: authError, data: authData },
  ] = useMutation<AuthenticateMutation, AuthenticateMutationVariables>(
    AUTHENTICATE
  );
  const {
    data: getMeData,
    loading: getMeLoading,
    error: getMeError,
    refetch,
  } = useQuery<GetMeQuery, GetMeQueryVariables>(GET_ME);
  const { authenticated, setUser, updateAuthenticated } = useUserStore();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined" && window.Telegram?.WebApp) {
      const data = window.Telegram.WebApp.initData;
      console.log(data);
      setInitData(data);
    }
  }, []);

  useEffect(() => {
    if (authenticate)
      if (initData && !authenticated) {
        const authenticateUser = async () => {
          try {
            await authenticate({
              variables: {
                input: {
                  initDataRaw: initData,
                },
              },
            });
            updateAuthenticated(true);
            await refetch();
            setUser(getMeData.getMe.user);
          } catch (err) {
            console.log("Authentication error", err);
          }
        };

        authenticateUser();
      }
  }, [initData, authenticated]);

  useEffect(() => {
    if (getMeData?.getMe.user) {
      setUser(getMeData.getMe.user);
      setIsLoading(false);
    } else {
      refetch();
    }
  }, [getMeData, authenticate]);

  if (isLoading || getMeLoading || authLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {initData ? (
        <div className="flex flex-col items-center">
          <pre className="bg-gray-100 p-4 rounded-md mb-4">{initData}</pre>
          <div>
            {!authLoading && authData
              ? authData.authenticate.toString()
              : "Загрузка..."}
          </div>
        </div>
      ) : (
        <p>Loading init data...</p>
      )}
      {children}
    </div>
  );
}

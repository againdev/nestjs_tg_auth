import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UserResponse } from "../gql/graphql";

interface UserState {
  id: string | undefined;
  tgId: number | undefined;
  firstName: string;
  lastName?: string;
  username?: string;
  isPremium?: boolean;
  languageCode?: string;
  allowsWriteToPm: boolean;
  photoUrl?: string;
  authenticated?: boolean;

  setUser: (user: UserResponse) => void;
  updateAuthenticated: (authenticated: boolean) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      id: undefined,
      tgId: undefined,
      firstName: "",
      allowsWriteToPm: false,

      setUser: (user) =>
        set({
          id: user.id || undefined,
          tgId: user.tgId || undefined,
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
          isPremium: user.isPremium,
          languageCode: user.languageCode,
          allowsWriteToPm: user.allowsWriteToPm,
          photoUrl: user.photoUrl,
        }),
      updateAuthenticated: (authenticated) =>
        set({
          authenticated,
        }),
    }),
    {
      name: "user-storage",
    }
  )
);

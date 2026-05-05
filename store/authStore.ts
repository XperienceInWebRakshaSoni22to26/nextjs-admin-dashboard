"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuthState = {
  token: string | null;
  username: string | null;
  isAuthenticated: boolean;
  setAuth: (payload: { token: string; username: string }) => void;
  clearAuth: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      username: null,
      isAuthenticated: false,
      setAuth: ({ token, username }) =>
        set({
          token,
          username,
          isAuthenticated: true,
        }),
      clearAuth: () =>
        set({
          token: null,
          username: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: "auth-storage",
    }
  )
);

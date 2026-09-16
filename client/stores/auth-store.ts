"use client";

import { create } from "zustand";

export type AuthUser = {
  id: number | string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  email_verified: boolean;
  image?: string;
};

type AuthState = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  setUser: (user: AuthUser | null) => void;
  setAuthenticated: (value: boolean) => void;
  setLoading: (value: boolean) => void;
  clearAuth: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
      isLoading: false,
    }),

  setAuthenticated: (value) =>
    set({
      isAuthenticated: value,
    }),

  setLoading: (value) =>
    set({
      isLoading: value,
    }),

  clearAuth: () =>
    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    }),
}));
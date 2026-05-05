"use client";

import { create } from "zustand";
import { api } from "@/lib/api";
import { User, UsersResponse } from "@/types/dummyjson";

type UsersState = {
  users: User[];
  total: number;
  loading: boolean;
  error: string | null;
  cache: Record<string, { users: User[]; total: number; timestamp: number }>;
  selectedUser: User | null;
  fetchUsers: (params: { limit: number; skip: number; q?: string }) => Promise<void>;
  fetchUserById: (id: string) => Promise<void>;
};

const TTL_MS = 1000 * 60 * 5;

export const useUsersStore = create<UsersState>((set, get) => ({
  users: [],
  total: 0,
  loading: false,
  error: null,
  cache: {},
  selectedUser: null,
  fetchUsers: async ({ limit, skip, q }) => {
    const key = q ? `search:${q}:${limit}:${skip}` : `list:${limit}:${skip}`;
    const cached = get().cache[key];

    // Cache reduces repeated list requests and makes pagination feel instant.
    if (cached && Date.now() - cached.timestamp < TTL_MS) {
      set({ users: cached.users, total: cached.total });
      return;
    }

    set({ loading: true, error: null });
    try {
      const endpoint = q
        ? `/users/search?q=${encodeURIComponent(q)}&limit=${limit}&skip=${skip}`
        : `/users?limit=${limit}&skip=${skip}`;
      const response = await api.get<UsersResponse>(endpoint);

      set((state) => ({
        users: response.data.users,
        total: response.data.total,
        loading: false,
        cache: {
          ...state.cache,
          [key]: {
            users: response.data.users,
            total: response.data.total,
            timestamp: Date.now(),
          },
        },
      }));
    } catch {
      set({ loading: false, error: "Failed to load users." });
    }
  },
  fetchUserById: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get<User>(`/users/${id}`);
      set({ selectedUser: response.data, loading: false });
    } catch {
      set({ loading: false, error: "Failed to load user details." });
    }
  },
}));

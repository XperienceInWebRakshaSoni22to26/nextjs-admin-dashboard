"use client";

import { create } from "zustand";
import { api } from "@/lib/api";
import { Product, ProductsResponse } from "@/types/dummyjson";

type ProductsState = {
  products: Product[];
  categories: string[];
  total: number;
  loading: boolean;
  error: string | null;
  cache: Record<string, { products: Product[]; total: number; timestamp: number }>;
  selectedProduct: Product | null;
  fetchProducts: (params: {
    limit: number;
    skip: number;
    q?: string;
    category?: string;
  }) => Promise<void>;
  fetchCategories: () => Promise<void>;
  fetchProductById: (id: string) => Promise<void>;
};

const TTL_MS = 1000 * 60 * 5;

export const useProductsStore = create<ProductsState>((set, get) => ({
  products: [],
  categories: [],
  total: 0,
  loading: false,
  error: null,
  cache: {},
  selectedProduct: null,
  fetchProducts: async ({ limit, skip, q, category }) => {
    const key = `p:${q ?? ""}:${category ?? ""}:${limit}:${skip}`;
    const cached = get().cache[key];

    // Cache avoids duplicate API calls when users revisit pages/filters.
    if (cached && Date.now() - cached.timestamp < TTL_MS) {
      set({ products: cached.products, total: cached.total });
      return;
    }

    set({ loading: true, error: null });
    try {
      const endpoint = (() => {
        if (category && category !== "all") {
          return `/products/category/${encodeURIComponent(
            category
          )}?limit=${limit}&skip=${skip}`;
        }
        if (q) {
          return `/products/search?q=${encodeURIComponent(q)}&limit=${limit}&skip=${skip}`;
        }
        return `/products?limit=${limit}&skip=${skip}`;
      })();

      const response = await api.get<ProductsResponse>(endpoint);

      set((state) => ({
        products: response.data.products,
        total: response.data.total,
        loading: false,
        cache: {
          ...state.cache,
          [key]: {
            products: response.data.products,
            total: response.data.total,
            timestamp: Date.now(),
          },
        },
      }));
    } catch {
      set({ loading: false, error: "Failed to load products." });
    }
  },
  fetchCategories: async () => {
    if (get().categories.length) return;
    try {
      const response = await api.get<Array<string | { slug: string; name: string }>>(
        "/products/categories"
      );
      const normalized = response.data.map((item) =>
        typeof item === "string" ? item : item.slug
      );
      set({ categories: normalized });
    } catch {
      set({ categories: [] });
    }
  },
  fetchProductById: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get<Product>(`/products/${id}`);
      set({ selectedProduct: response.data, loading: false });
    } catch {
      set({ loading: false, error: "Failed to load product details." });
    }
  },
}));

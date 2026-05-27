import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { Food, FoodLogResponse } from "@/types";

export type CreateFoodInput = {
  name: string;
  unit: string;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  tag?: string;
  aliases?: string[];
};

export function useFoods(search: string, tag: string) {
  return useQuery<Food[]>({
    queryKey: ["foods", search, tag],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (tag && tag !== "all") params.set("tag", tag);
      params.set("limit", "50");
      const res = await api.get(`/foods?${params.toString()}`);
      return res.data.data;
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useSavedMeals() {
  return useQuery<Food[]>({
    queryKey: ["saved-meals"],
    queryFn: async () => {
      const res = await api.get("/foods/saved-meals");
      return res.data.data;
    },
  });
}

export function useCreateFood() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateFoodInput) => api.post("/foods", payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["foods"] });
      queryClient.invalidateQueries({ queryKey: ["saved-meals"] });
    },
  });
}

export function useFoodLog(date: string) {
  return useQuery<FoodLogResponse>({
    queryKey: ["food-log", date],
    queryFn: async () => {
      const res = await api.get(`/food-log?date=${date}`);
      return res.data;
    },
    staleTime: 1000 * 30,
  });
}

export function useAddFoodLog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      foodId: string;
      mealType: string;
      servings: number;
      date: string;
    }) => api.post("/food-log", payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["food-log", variables.date] });
      queryClient.invalidateQueries({
        queryKey: ["dashboard", variables.date],
      });
    },
  });
}

export function useUpdateFoodLog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      id: string;
      servings?: number;
      mealType?: string;
      date: string;
    }) =>
      api.put(`/food-log/${payload.id}`, {
        servings: payload.servings,
        mealType: payload.mealType,
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["food-log", variables.date] });
      queryClient.invalidateQueries({
        queryKey: ["dashboard", variables.date],
      });
    },
  });
}

export function useDeleteFoodLog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { id: string; date: string }) =>
      api.delete(`/food-log/${payload.id}`),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["food-log", variables.date] });
      queryClient.invalidateQueries({
        queryKey: ["dashboard", variables.date],
      });
    },
  });
}

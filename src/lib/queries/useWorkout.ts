import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { WorkoutPlan, WorkoutLog } from "@/types";

export function useTodayWorkout() {
  return useQuery<{
    plan: WorkoutPlan;
    today: any;
    currentPlanDayIndex: number;
  }>({
    queryKey: ["workout-today"],
    queryFn: async () => {
      const res = await api.get("/workout/today");
      return res.data.data;
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useWorkoutPlans() {
  return useQuery<WorkoutPlan[]>({
    queryKey: ["workout-plans"],
    queryFn: async () => {
      const res = await api.get("/workout/plans");
      return res.data.data;
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useWorkoutPlan(id: string) {
  return useQuery<WorkoutPlan>({
    queryKey: ["workout-plan", id],
    queryFn: async () => {
      const res = await api.get(`/workout/plans/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });
}

export function useWorkoutLog(date: string) {
  return useQuery<WorkoutLog[]>({
    queryKey: ["workout-log", date],
    queryFn: async () => {
      const res = await api.get(`/workout/log?date=${date}`);
      return res.data.data;
    },
    staleTime: 1000 * 30,
  });
}

export function useExerciseHistory(exerciseName: string) {
  return useQuery({
    queryKey: ["exercise-history", exerciseName],
    queryFn: async () => {
      const res = await api.get(
        `/workout/log/exercise/${encodeURIComponent(exerciseName)}/history`,
      );
      return res.data;
    },
    enabled: !!exerciseName,
    staleTime: 1000 * 60 * 2,
  });
}

export function useCreateWorkoutLog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      planId?: string;
      planDayId?: string;
      workoutName: string;
      muscleGroups: string[];
      exercises: any[];
      durationMinutes: number;
      notes?: string;
      date: string;
    }) => api.post("/workout/log", payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["workout-log", variables.date],
      });
      queryClient.invalidateQueries({
        queryKey: ["dashboard", variables.date],
      });
    },
  });
}

export function useUpdateWorkoutLog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      id: string;
      exercises: any[];
      durationMinutes?: number;
      date: string;
    }) => api.put(`/workout/log/${payload.id}`, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["workout-log", variables.date],
      });
      queryClient.invalidateQueries({
        queryKey: ["dashboard", variables.date],
      });
    },
  });
}

export function useDeleteWorkoutLog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { id: string; date: string }) =>
      api.delete(`/workout/log/${payload.id}`),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["workout-log", variables.date],
      });
      queryClient.invalidateQueries({
        queryKey: ["dashboard", variables.date],
      });
    },
  });
}

export function useAdvanceWorkoutDay() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => api.post("/workout/advance-day"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workout-today"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useSetWorkoutDay() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { dayIndex: number }) =>
      api.post("/workout/set-day", payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workout-today"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

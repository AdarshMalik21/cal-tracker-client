import { create } from 'zustand'
import { MealType } from '@/types'

interface UIStore {
  foodSheetOpen: boolean
  foodSheetMealType: MealType
  activitySheetOpen: boolean
  workoutSheetExercise: string | null

  openFoodSheet: (mealType: MealType) => void
  closeFoodSheet: () => void
  openActivitySheet: () => void
  closeActivitySheet: () => void
  openWorkoutSheet: (exerciseName: string) => void
  closeWorkoutSheet: () => void
}

export const useUIStore = create<UIStore>((set) => ({
  foodSheetOpen:        false,
  foodSheetMealType:    'breakfast',
  activitySheetOpen:    false,
  workoutSheetExercise: null,

  openFoodSheet:    (mealType) => set({ foodSheetOpen: true, foodSheetMealType: mealType }),
  closeFoodSheet:   ()         => set({ foodSheetOpen: false }),
  openActivitySheet:()         => set({ activitySheetOpen: true }),
  closeActivitySheet:()        => set({ activitySheetOpen: false }),
  openWorkoutSheet: (name)     => set({ workoutSheetExercise: name }),
  closeWorkoutSheet:()         => set({ workoutSheetExercise: null }),
}))
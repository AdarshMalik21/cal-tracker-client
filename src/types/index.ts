export interface Profile {
  _id: string;
  name: string;
  age: number;
  heightCm: number;
  currentWeightKg: number;
  goalWeightKg: number;
  gender: "male" | "female";
  goal: "lose_fat" | "lean_bulk" | "maintain";
  activityLevel: "sedentary" | "light" | "moderate" | "active" | "very_active";
  calorieGoal: number;
  proteinGoalG: number;
  carbsGoalG: number;
  fatGoalG: number;
  autoCalculateTargets: boolean;
  waterGoalGlasses: number;
  workoutDaysPerWeek: number;
  restDays: string[];
  activeWorkoutPlanId: string | null;
  supplementReminders: boolean;
  weeklyReviewDay: string;
}

export interface MacroGoals {
  protein: number;
  carbs: number;
  fat: number;
}

export interface Macros {
  protein: number;
  carbs: number;
  fat: number;
}

export interface SupplementStatus {
  supplementId: string;
  name: string;
  dose: string;
  timing: string;
  taken: boolean;
}

export interface TodayData {
  caloriesEaten: number;
  caloriesBurned: number;
  netCalories: number;
  calorieGoal: number;
  surplus: number;
  macros: Macros;
  macroGoals: MacroGoals;
  water: { glasses: number; goal: number };
  sleep: { hoursSlept: number; quality: number } | null;
  soreness: { muscles: { name: string; level: number }[] } | null;
  supplements: SupplementStatus[];
  supplementsDone: number;
  supplementsTotal: number;
  workoutDone: boolean;
  workoutLog: WorkoutLog | null;
  todaysPlan: PlanDay | null;
  weightLogged: number | null;
  coachInsights: string[];
}

export interface WeeklyStats {
  weekLabel: string;
  start: string;
  end: string;
  avgNetKcal: number;
  avgProtein: number;
  avgBurned: number;
  gymSessions: number;
  targetSessions: number;
  streak: number;
}

export interface DashboardData {
  date: string;
  profile: Profile;
  today: TodayData;
  weeklyStats: WeeklyStats;
}

export interface Food {
  _id: string;
  name: string;
  unit: string;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  tag: string;
  category: string;
  aliases: string[];
  isCustom: boolean;
  isSavedMeal: boolean;
  savedMealItems?: SavedMealItem[];
}

export interface SavedMealItem {
  foodId: string;
  foodName: string;
  servings: number;
}

export interface FoodLogEntry {
  _id: string;
  foodId: string;
  foodSnapshot: {
    name: string;
    unit: string;
    kcal: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  mealType: MealType;
  servings: number;
  totalKcal: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  date: string;
  loggedAt: string;
}

export type MealType =
  | "breakfast"
  | "lunch"
  | "dinner"
  | "pre_workout"
  | "post_workout"
  | "snacks";

export interface FoodLogResponse {
  date: string;
  totals: Macros & { kcal: number };
  grouped: Record<MealType, FoodLogEntry[]>;
  all: FoodLogEntry[];
}

export interface Activity {
  _id: string;
  name: string;
  category: "gym" | "cardio" | "daily" | "sports" | "custom";
  MET: number;
  isCustom: boolean;
}

export interface ActivityLogEntry {
  _id: string;
  activityId: string;
  activitySnapshot: {
    name: string;
    category: string;
    MET: number;
  };
  durationMinutes: number;
  caloriesBurned: number;
  weightKgAtTime: number;
  date: string;
}

export interface Exercise {
  name: string;
  muscleGroup: string;
  defaultSets: number;
  defaultReps: number;
  defaultWeightKg: number;
  notes?: string;
}

export interface PlanDay {
  _id: string;
  dayName: string;
  dayType: "workout" | "rest";
  muscleGroups: string[];
  exercises: Exercise[];
}

export interface WorkoutPlan {
  _id: string;
  name: string;
  split: string;
  days: PlanDay[];
  isCustom: boolean;
  isActive: boolean;
}

export interface SetLog {
  setNumber: number;
  weightKg: number;
  reps: number;
  completed: boolean;
  isPersonalRecord: boolean;
}

export interface ExerciseLog {
  name: string;
  muscleGroup: string;
  sets: SetLog[];
  notes?: string;
}

export interface WorkoutLog {
  _id: string;
  planId: string;
  planDayId: string;
  workoutName: string;
  muscleGroups: string[];
  exercises: ExerciseLog[];
  durationMinutes: number;
  notes: string;
  date: string;
}

export interface WeightLogEntry {
  _id: string;
  weightKg: number;
  date: string;
  notes?: string;
}

export interface Measurement {
  _id: string;
  weightKg: number | null;
  chest: number | null;
  waist: number | null;
  hips: number | null;
  bicepR: number | null;
  bicepL: number | null;
  thighR: number | null;
  thighL: number | null;
  shoulderWidth: number | null;
  notes: string;
  date: string;
}

export interface Supplement {
  _id: string;
  name: string;
  dose: string;
  timing: string;
  isCustom: boolean;
}

export interface WeeklyReview {
  _id: string;
  weekLabel: string;
  energyLevel: "low" | "ok" | "good" | "high";
  gymSessions: number;
  weightKg: number;
  notes: string;
  coachFeedback: string[];
}

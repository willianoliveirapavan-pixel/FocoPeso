export type PlanType = 'free' | 'pro' | 'premium';

export type Gender = 'masculino' | 'feminino';

export type Goal = 'lose' | 'maintain' | 'gain';

export type FormulaType = 'mifflin' | 'harris';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  password?: string;
  age: number;
  gender: Gender;
  currentWeight: number; // in kg
  targetWeight: number;  // in kg
  height: number;        // in cm
  activityLevel: number; // multiplier e.g. 1.2, 1.375, etc.
  goal: Goal;
  plan: PlanType;
  formula: FormulaType;
  createdAt: string;
}

export interface WeightEntry {
  id: string;
  date: string;
  weight: number;
  note?: string;
}

export interface MacroBreakdown {
  tmb: number;
  tdee: number;
  targetCalories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatsGrams: number;
  proteinPct: number;
  carbsPct: number;
  fatsPct: number;
  deficitOrSurplus: number;
}

export interface MealItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  portion: string;
  category: 'breakfast' | 'lunch' | 'snack' | 'dinner' | 'supper';
}

export interface MealCategoryPlan {
  category: 'breakfast' | 'lunch' | 'snack' | 'dinner' | 'supper';
  title: string;
  timeRange: string;
  items: MealItem[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
}

export interface FoodLogEntry {
  id: string;
  date: string;
  time: string;
  name: string;
  category: 'breakfast' | 'lunch' | 'snack' | 'dinner' | 'supper';
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface WaterLog {
  date: string;
  targetMl: number;
  consumedMl: number;
}

export type TabType = 'overview' | 'profile' | 'calculator' | 'mealplan' | 'diary' | 'pricing';

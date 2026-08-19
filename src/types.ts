export type MealType = 'cafe' | 'almoco' | 'jantar' | 'lanche';

export interface FoodItem {
  id: string;
  name: string;
  portionGrams: number;
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
}

export interface MealLog {
  id: string;
  userId: string;
  dishName: string;
  mealType: MealType;
  date: string; // ISO format YYYY-MM-DD
  timestamp: number;
  items: FoodItem[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  imageUrl?: string;
  summaryTip?: string;
}

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  dailyCalorieGoal: number; // e.g. 2000
  dailyProteinGoal: number; // e.g. 150g
  dailyCarbsGoal: number;   // e.g. 220g
  dailyFatGoal: number;     // e.g. 60g
  currentWeight: number;    // kg
  targetWeight: number;     // kg
  height: number;           // cm
  gender: 'masculino' | 'feminino';
  activityLevel: number;    // multiplier
  plan?: 'beta';
  role?: 'user' | 'admin';
  isPaid?: boolean;
  updatedAt?: number;
}

export interface AiFoodAnalysisResult {
  dishName: string;
  confidenceScore: number;
  summaryTip: string;
  items: Array<{
    name: string;
    portionGrams: number;
    calories: number;
    proteinGrams: number;
    carbsGrams: number;
    fatGrams: number;
  }>;
}

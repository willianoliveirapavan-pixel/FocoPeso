import { UserProfile, WeightEntry, FoodLogEntry, WaterLog, PlanType } from '../types';
import {
  saveUserProfileToFirestore,
  addWeightLogToFirestore,
  addFoodLogToFirestore,
  saveWaterLogToFirestore,
  getWeightLogsFromFirestore,
  getFoodLogsFromFirestore,
  getWaterLogFromFirestore,
} from '../services/firebaseService';

const STORAGE_KEYS = {
  USER: 'nutricalc_user',
  WEIGHT_LOGS: 'nutricalc_weight_logs',
  FOOD_LOGS: 'nutricalc_food_logs',
  WATER_LOG: 'nutricalc_water_log',
  IS_LOGGED_IN: 'nutricalc_logged_in',
};

export const DEFAULT_USER: UserProfile = {
  id: 'usr_demo_101',
  name: 'Willian Silva',
  email: 'willian@exemplo.com.br',
  password: '123',
  age: 28,
  gender: 'masculino',
  currentWeight: 82.5,
  targetWeight: 76.0,
  height: 178,
  activityLevel: 1.55,
  goal: 'lose',
  plan: 'free',
  formula: 'mifflin',
  createdAt: new Date().toISOString()
};

export const INITIAL_WEIGHT_LOGS: WeightEntry[] = [
  { id: 'w1', date: '2026-07-01', weight: 85.0, note: 'Início da jornada Emagrecerei' },
  { id: 'w2', date: '2026-07-15', weight: 84.1, note: 'Foco no déficit calórico' },
  { id: 'w3', date: '2026-07-28', weight: 83.2, note: 'Aumentei hidratação' },
  { id: 'w4', date: '2026-08-04', weight: 82.5, note: 'Pesagem atual' },
];

export const INITIAL_FOOD_LOGS: FoodLogEntry[] = [
  {
    id: 'fl1',
    date: new Date().toISOString().split('T')[0],
    time: '08:15',
    name: 'Ovos Mexidos (3 un) + Pão Integral (2 fat)',
    category: 'breakfast',
    calories: 320,
    protein: 22,
    carbs: 26,
    fat: 14
  },
  {
    id: 'fl2',
    date: new Date().toISOString().split('T')[0],
    time: '12:45',
    name: 'Peito de Frango (150g) + Arroz (120g) + Feijão',
    category: 'lunch',
    calories: 510,
    protein: 48,
    carbs: 48,
    fat: 11
  }
];

export function getUser(): UserProfile {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.USER);
    if (!data) return DEFAULT_USER;
    return JSON.parse(data);
  } catch {
    return DEFAULT_USER;
  }
}

export function saveUser(user: UserProfile): void {
  try {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    // Sincronizar com Firestore
    if (user.id) {
      saveUserProfileToFirestore(user);
    }
  } catch (e) {
    console.error('Error saving user:', e);
  }
}

export function updateUserPlan(plan: PlanType): UserProfile {
  const user = getUser();
  const updated = { ...user, plan };
  saveUser(updated);
  return updated;
}

export function isLoggedIn(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEYS.IS_LOGGED_IN) === 'true';
  } catch {
    return false;
  }
}

export function setLoggedIn(status: boolean): void {
  try {
    localStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, status ? 'true' : 'false');
  } catch (e) {
    console.error('Error setting login status:', e);
  }
}

export function getWeightLogs(): WeightEntry[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.WEIGHT_LOGS);
    if (!data) return INITIAL_WEIGHT_LOGS;
    return JSON.parse(data);
  } catch {
    return INITIAL_WEIGHT_LOGS;
  }
}

export function saveWeightLog(entry: Omit<WeightEntry, 'id'>): WeightEntry[] {
  const current = getWeightLogs();
  const user = getUser();
  const newEntry: WeightEntry = {
    ...entry,
    id: 'w_' + Date.now().toString()
  };
  const updated = [...current, newEntry].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  localStorage.setItem(STORAGE_KEYS.WEIGHT_LOGS, JSON.stringify(updated));

  if (user?.id) {
    addWeightLogToFirestore(user.id, entry);
  }

  return updated;
}

export function getFoodLogs(): FoodLogEntry[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.FOOD_LOGS);
    if (!data) return INITIAL_FOOD_LOGS;
    return JSON.parse(data);
  } catch {
    return INITIAL_FOOD_LOGS;
  }
}

export function addFoodLog(entry: Omit<FoodLogEntry, 'id'>): FoodLogEntry[] {
  const current = getFoodLogs();
  const user = getUser();
  const newEntry: FoodLogEntry = {
    ...entry,
    id: 'fl_' + Date.now().toString()
  };
  const updated = [newEntry, ...current];
  localStorage.setItem(STORAGE_KEYS.FOOD_LOGS, JSON.stringify(updated));

  if (user?.id) {
    addFoodLogToFirestore(user.id, entry);
  }

  return updated;
}

export function getWaterLog(): WaterLog {
  const today = new Date().toISOString().split('T')[0];
  try {
    const data = localStorage.getItem(STORAGE_KEYS.WATER_LOG);
    if (data) {
      const parsed = JSON.parse(data);
      if (parsed.date === today) return parsed;
    }
  } catch (e) {
    console.error('Error parsing water log', e);
  }
  return { date: today, targetMl: 2500, consumedMl: 1250 };
}

export function saveWaterLog(log: WaterLog): void {
  const user = getUser();
  try {
    localStorage.setItem(STORAGE_KEYS.WATER_LOG, JSON.stringify(log));
    if (user?.id) {
      saveWaterLogToFirestore(user.id, log);
    }
  } catch (e) {
    console.error('Error saving water log', e);
  }
}


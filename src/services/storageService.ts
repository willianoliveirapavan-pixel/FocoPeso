import { UserProfile, MealLog, MealType } from '../types';
import { db, auth } from '../firebase';
import { collection, doc, setDoc, getDoc, getDocs, deleteDoc, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { signInAnonymously, onAuthStateChanged, User } from 'firebase/auth';

const PROFILE_STORAGE_KEY = 'focopeso_user_profile';
const MEALS_STORAGE_KEY = 'focopeso_meals_log';

export const DEFAULT_USER_PROFILE: UserProfile = {
  uid: 'local_user',
  name: 'Usuário FocoPeso',
  email: 'usuario@focopeso.app',
  dailyCalorieGoal: 2000,
  dailyProteinGoal: 140,
  dailyCarbsGoal: 210,
  dailyFatGoal: 60,
  currentWeight: 75,
  targetWeight: 70,
  height: 175,
  gender: 'masculino',
  activityLevel: 1.55,
};

// Initialize Firebase Auth listener and return user
export function initializeAuth(onUserChanged: (user: UserProfile | null) => void) {
  return onAuthStateChanged(auth, async (firebaseUser: User | null) => {
    if (firebaseUser) {
      const userDocRef = doc(db, 'users', firebaseUser.uid);
      try {
        const snap = await getDoc(userDocRef);
        if (snap.exists()) {
          const profile = snap.data() as UserProfile;
          saveLocalProfile(profile);
          onUserChanged(profile);
        } else {
          // Initialize profile in Firestore
          const newProfile: UserProfile = {
            ...DEFAULT_USER_PROFILE,
            uid: firebaseUser.uid,
            email: firebaseUser.email || 'usuario@focopeso.app',
            name: firebaseUser.displayName || 'Atleta FocoPeso',
          };
          await setDoc(userDocRef, newProfile);
          saveLocalProfile(newProfile);
          onUserChanged(newProfile);
        }
      } catch (err) {
        console.warn('Firestore user fetch failed, using local profile fallback:', err);
        const fallbackProfile: UserProfile = {
          ...DEFAULT_USER_PROFILE,
          uid: firebaseUser.uid,
          email: firebaseUser.email || 'usuario@focopeso.app',
          name: firebaseUser.displayName || 'Atleta FocoPeso',
        };
        onUserChanged(fallbackProfile);
      }
    } else {
      // Unauthenticated state
      onUserChanged(null);
    }
  });
}

// Helper to get user-scoped storage keys
function getProfileKey(uid?: string): string {
  const targetUid = uid || auth.currentUser?.uid || 'guest';
  return `focopeso_user_profile_${targetUid}`;
}

function getMealsKey(uid?: string): string {
  const targetUid = uid || auth.currentUser?.uid || 'guest';
  return `focopeso_meals_log_${targetUid}`;
}

// Local Storage Handlers
export function getLocalProfile(uid?: string): UserProfile {
  try {
    const key = getProfileKey(uid);
    const data = localStorage.getItem(key) || localStorage.getItem(PROFILE_STORAGE_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Error reading local profile:', e);
  }
  return DEFAULT_USER_PROFILE;
}

export function saveLocalProfile(profile: UserProfile): void {
  try {
    const key = getProfileKey(profile.uid);
    localStorage.setItem(key, JSON.stringify(profile));
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error('Error saving local profile:', e);
  }
}

export async function updateUserProfile(profile: UserProfile): Promise<void> {
  saveLocalProfile(profile);
  if (auth.currentUser) {
    try {
      const userRef = doc(db, 'users', auth.currentUser.uid);
      await setDoc(userRef, { ...profile, uid: auth.currentUser.uid }, { merge: true });
    } catch (e) {
      console.warn('Could not sync profile to Firestore:', e);
    }
  }
}

// Meal Log Operations
export function getLocalMeals(uid?: string): MealLog[] {
  const targetUid = uid || auth.currentUser?.uid;
  if (!targetUid) return [];

  try {
    const key = getMealsKey(targetUid);
    const data = localStorage.getItem(key);
    if (data) {
      const parsed: MealLog[] = JSON.parse(data);
      return parsed.filter((m) => m.userId === targetUid);
    }
  } catch (e) {
    console.error('Error reading local meals:', e);
  }
  return [];
}

export function saveLocalMeals(meals: MealLog[], uid?: string): void {
  const targetUid = uid || auth.currentUser?.uid;
  if (!targetUid) return;

  try {
    const key = getMealsKey(targetUid);
    const userMeals = meals.filter((m) => m.userId === targetUid);
    localStorage.setItem(key, JSON.stringify(userMeals));
  } catch (e) {
    console.error('Error saving local meals:', e);
  }
}

export async function addMealLog(meal: MealLog): Promise<void> {
  const currentUid = auth.currentUser?.uid || meal.userId;
  const newMeal: MealLog = {
    ...meal,
    userId: currentUid,
  };

  const current = getLocalMeals(currentUid);
  const updated = [newMeal, ...current];
  saveLocalMeals(updated, currentUid);

  if (auth.currentUser) {
    try {
      const mealRef = doc(db, 'meals', newMeal.id);
      await setDoc(mealRef, newMeal);
    } catch (e) {
      console.warn('Could not sync meal log to Firestore:', e);
    }
  }
}

export async function updateMealLog(updatedMeal: MealLog): Promise<void> {
  const currentUid = auth.currentUser?.uid || updatedMeal.userId;
  const mealToSave: MealLog = {
    ...updatedMeal,
    userId: currentUid,
  };

  const current = getLocalMeals(currentUid);
  const idx = current.findIndex((m) => m.id === mealToSave.id);
  if (idx !== -1) {
    current[idx] = mealToSave;
    saveLocalMeals(current, currentUid);
  }

  if (auth.currentUser) {
    try {
      const mealRef = doc(db, 'meals', mealToSave.id);
      await setDoc(mealRef, mealToSave, { merge: true });
    } catch (e) {
      console.warn('Could not sync updated meal to Firestore:', e);
    }
  }
}

export async function deleteMealLog(mealId: string): Promise<void> {
  const currentUid = auth.currentUser?.uid;
  if (currentUid) {
    const current = getLocalMeals(currentUid);
    const updated = current.filter((m) => m.id !== mealId);
    saveLocalMeals(updated, currentUid);
  }

  if (auth.currentUser) {
    try {
      const mealRef = doc(db, 'meals', mealId);
      await deleteDoc(mealRef);
    } catch (e) {
      console.warn('Could not delete meal from Firestore:', e);
    }
  }
}

// Subscribe to real-time meal updates for all dates
export function subscribeAllMeals(callback: (meals: MealLog[]) => void) {
  const currentUid = auth.currentUser?.uid;
  const local = getLocalMeals(currentUid);
  local.sort((a, b) => (b.date === a.date ? b.timestamp - a.timestamp : b.date.localeCompare(a.date)));
  callback(local);

  if (!auth.currentUser) {
    return () => {};
  }

  try {
    const uid = auth.currentUser.uid;
    const q = query(
      collection(db, 'meals'),
      where('userId', '==', uid)
    );

    return onSnapshot(q, (snapshot) => {
      const firestoreMeals: MealLog[] = [];
      snapshot.forEach((docSnap) => {
        firestoreMeals.push(docSnap.data() as MealLog);
      });

      firestoreMeals.sort((a, b) => (b.date === a.date ? b.timestamp - a.timestamp : b.date.localeCompare(a.date)));

      saveLocalMeals(firestoreMeals, uid);
      callback(firestoreMeals);
    }, (error) => {
      console.warn('Firestore real-time subscription error:', error);
      const fallbackLocal = getLocalMeals(uid);
      fallbackLocal.sort((a, b) => (b.date === a.date ? b.timestamp - a.timestamp : b.date.localeCompare(a.date)));
      callback(fallbackLocal);
    });
  } catch (e) {
    console.warn('Failed to subscribe to Firestore:', e);
    return () => {};
  }
}

// Subscribe to real-time meal updates for a specific date (YYYY-MM-DD)
export function subscribeMealsByDate(dateStr: string, callback: (meals: MealLog[]) => void) {
  const currentUid = auth.currentUser?.uid;
  // First emit local meals
  const local = getLocalMeals(currentUid).filter((m) => m.date === dateStr);
  callback(local);

  if (!auth.currentUser) {
    return () => {};
  }

  try {
    const uid = auth.currentUser.uid;
    const q = query(
      collection(db, 'meals'),
      where('userId', '==', uid),
      where('date', '==', dateStr)
    );

    return onSnapshot(q, (snapshot) => {
      const firestoreMeals: MealLog[] = [];
      snapshot.forEach((docSnap) => {
        firestoreMeals.push(docSnap.data() as MealLog);
      });
      
      // Sort by timestamp descending
      firestoreMeals.sort((a, b) => b.timestamp - a.timestamp);
      
      // Sync local cache
      const allLocal = getLocalMeals(uid).filter((m) => m.date !== dateStr);
      saveLocalMeals([...firestoreMeals, ...allLocal], uid);

      callback(firestoreMeals);
    }, (error) => {
      console.warn('Firestore real-time subscription error:', error);
      callback(getLocalMeals(uid).filter((m) => m.date === dateStr));
    });
  } catch (e) {
    console.warn('Failed to subscribe to Firestore:', e);
    return () => {};
  }
}

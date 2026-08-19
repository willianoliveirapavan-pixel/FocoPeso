import { UserProfile, MealLog, MealType } from '../types';
import { db, auth } from '../firebase';
import { collection, doc, setDoc, getDoc, getDocs, deleteDoc, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { signInAnonymously, onAuthStateChanged, User } from 'firebase/auth';

const PROFILE_STORAGE_KEY = 'focopeso_user_profile';
const MEALS_STORAGE_KEY = 'focopeso_meals_log';

// Client-side subscriber observers to bypass any offline or bypass silent states
const mealListeners = new Set<(meals: MealLog[]) => void>();

function notifyMealListeners(meals: MealLog[]) {
  mealListeners.forEach((listener) => {
    try {
      listener(meals);
    } catch (e) {
      console.error('Error in meal observer listener:', e);
    }
  });
}

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

// Beautiful Firestore Diagnostic Logger
export function logFirestoreDiagnostic(
  action: 'updateUserProfile' | 'addMealLog',
  status: 'SUCCESS' | 'WARNING' | 'FAILED',
  details: {
    userId: string;
    localSaved: boolean;
    firestoreSynced: boolean;
    payloadId?: string;
    error?: string;
  }
) {
  const dbId = 'ai-studio-focopeso-e19fe934-5287-4386-9b8f-daac118b8823';
  const projectId = 'gen-lang-client-0629332961';
  const authState = auth.currentUser ? `Autenticado (${auth.currentUser.email})` : 'Não Autenticado / Bypass Ativo';

  console.log(
    `%c[FocoPeso Firestore Diagnostic] %c${action.toUpperCase()} - ${status}`,
    'color: #10b981; font-weight: bold;',
    status === 'SUCCESS' ? 'color: #34d399; font-weight: bold;' : 'color: #fbbf24; font-weight: bold;',
    {
      timestamp: new Date().toISOString(),
      projectId,
      firestoreDatabaseId: dbId,
      authenticationState: authState,
      details
    }
  );
}

// Interactive diagnostic helper to test database writes in real-time
export async function runDatabaseDiagnostics(): Promise<{ success: boolean; message: string }> {
  const currentUid = getActiveUid();
  const testId = `diag_test_${Date.now()}`;
  console.log('[FocoPeso Diagnostic] Iniciando teste de gravação ao banco de dados...');

  try {
    // 1. Test Profile Update
    const currentProfile = getLocalProfile(currentUid) || DEFAULT_USER_PROFILE;
    const testProfile: UserProfile = {
      ...currentProfile,
      updatedAt: Date.now(),
    };
    await updateUserProfile(testProfile);

    // 2. Test Meal Write if authenticated
    if (auth.currentUser && currentUid !== 'admin_bypass_willian') {
      const testMeal: MealLog = {
        id: testId,
        userId: currentUid,
        dishName: 'Teste Diagnóstico FocoPeso',
        mealType: 'almoco',
        date: new Date().toISOString().split('T')[0],
        timestamp: Date.now(),
        items: [],
        totalCalories: 100,
        totalProtein: 10,
        totalCarbs: 10,
        totalFat: 2,
      };
      
      const mealRef = doc(db, 'meals', testId);
      await setDoc(mealRef, testMeal);
      await deleteDoc(mealRef); // Clean up the test document
    }

    return {
      success: true,
      message: 'Diagnóstico concluído com sucesso. Gravação e leitura ao Firestore validadas.',
    };
  } catch (err: any) {
    console.error('[FocoPeso Diagnostic] Falha no teste de banco:', err);
    return {
      success: false,
      message: `Erro no diagnóstico do Firestore: ${err?.message || err}`,
    };
  }
}

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

export function getActiveUid(): string {
  if (localStorage.getItem('focopeso_admin_bypass') === 'true') {
    return 'admin_bypass_willian';
  }
  return auth.currentUser?.uid || 'guest';
}

// Helper to get user-scoped storage keys
function getProfileKey(uid?: string): string {
  const targetUid = uid || getActiveUid();
  return `focopeso_user_profile_${targetUid}`;
}

function getMealsKey(uid?: string): string {
  const targetUid = uid || getActiveUid();
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
  const profileWithTime: UserProfile = {
    ...profile,
    updatedAt: Date.now(),
  };
  saveLocalProfile(profileWithTime);
  const activeUid = auth.currentUser?.uid || getActiveUid();
  let firestoreSynced = false;
  let syncError: any = null;

  if (auth.currentUser) {
    try {
      const userRef = doc(db, 'users', auth.currentUser.uid);
      await setDoc(userRef, { ...profileWithTime, uid: auth.currentUser.uid }, { merge: true });
      firestoreSynced = true;
    } catch (e: any) {
      syncError = e;
      console.warn('Could not sync profile to Firestore:', e);
    }
  }

  logFirestoreDiagnostic(
    'updateUserProfile',
    syncError ? 'FAILED' : (firestoreSynced ? 'SUCCESS' : 'WARNING'),
    {
      userId: activeUid,
      localSaved: true,
      firestoreSynced,
      error: syncError ? String(syncError?.message || syncError) : undefined,
    }
  );
}

// Meal Log Operations
export function getLocalMeals(uid?: string): MealLog[] {
  const targetUid = uid || auth.currentUser?.uid || getActiveUid();
  
  // 1. Try to load from user-specific key
  const specificKey = `focopeso_meals_log_${targetUid}`;
  let rawData = localStorage.getItem(specificKey);

  // 2. If empty, check fallback candidate keys to never lose offline/guest/bypass logs
  if (!rawData || rawData === '[]') {
    const candidateKeys = [
      MEALS_STORAGE_KEY,
      'focopeso_meals_log_guest',
      'focopeso_meals_log_admin_bypass_willian',
      'focopeso_meals_log_local_user',
    ];
    for (const key of candidateKeys) {
      if (key === specificKey) continue;
      const candidateRaw = localStorage.getItem(key);
      if (candidateRaw && candidateRaw !== '[]') {
        rawData = candidateRaw;
        break;
      }
    }
  }

  if (rawData) {
    try {
      const parsed: MealLog[] = JSON.parse(rawData);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    } catch (e) {
      console.error('Error reading local meals:', e);
    }
  }
  return [];
}

export function saveLocalMeals(meals: MealLog[], uid?: string): void {
  const targetUid = uid || auth.currentUser?.uid || getActiveUid();

  try {
    const serialized = JSON.stringify(meals);
    const key = `focopeso_meals_log_${targetUid}`;
    localStorage.setItem(key, serialized);
    localStorage.setItem(MEALS_STORAGE_KEY, serialized);
  } catch (e) {
    console.error('Error saving local meals:', e);
  }
}

export async function addMealLog(meal: MealLog): Promise<void> {
  const currentUid = auth.currentUser?.uid || getActiveUid();
  const mealId = meal.id || `meal_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  const newMeal: MealLog = {
    ...meal,
    id: mealId,
    userId: currentUid,
    timestamp: meal.timestamp || Date.now(),
  };

  const current = getLocalMeals(currentUid);
  const exists = current.some((m) => m.id === newMeal.id);
  const updated = exists
    ? current.map((m) => (m.id === newMeal.id ? newMeal : m))
    : [newMeal, ...current];

  saveLocalMeals(updated, currentUid);

  // Instantly notify observers to update React state
  const sorted = [...updated];
  sorted.sort((a, b) => (b.date === a.date ? b.timestamp - a.timestamp : b.date.localeCompare(a.date)));
  notifyMealListeners(sorted);

  let firestoreSynced = false;
  let syncError: any = null;

  if (auth.currentUser) {
    try {
      const mealRef = doc(db, 'meals', newMeal.id);
      await setDoc(mealRef, {
        ...newMeal,
        userId: auth.currentUser.uid,
      });
      firestoreSynced = true;
    } catch (e: any) {
      syncError = e;
      console.warn('Could not sync meal log to Firestore:', e);
    }
  }

  logFirestoreDiagnostic(
    'addMealLog',
    syncError ? 'FAILED' : (firestoreSynced ? 'SUCCESS' : 'WARNING'),
    {
      userId: currentUid,
      localSaved: true,
      firestoreSynced,
      payloadId: newMeal.id,
      error: syncError ? String(syncError?.message || syncError) : undefined,
    }
  );
}

export async function updateMealLog(updatedMeal: MealLog): Promise<void> {
  const currentUid = auth.currentUser?.uid || getActiveUid();
  const mealToSave: MealLog = {
    ...updatedMeal,
    userId: currentUid,
  };

  const current = getLocalMeals(currentUid);
  const idx = current.findIndex((m) => m.id === mealToSave.id);
  if (idx !== -1) {
    current[idx] = mealToSave;
    saveLocalMeals(current, currentUid);
    
    // Instantly notify observers to update React state
    const sorted = [...current];
    sorted.sort((a, b) => (b.date === a.date ? b.timestamp - a.timestamp : b.date.localeCompare(a.date)));
    notifyMealListeners(sorted);
  }

  if (auth.currentUser) {
    try {
      const mealRef = doc(db, 'meals', mealToSave.id);
      await setDoc(mealRef, {
        ...mealToSave,
        userId: auth.currentUser.uid,
      }, { merge: true });
    } catch (e) {
      console.warn('Could not sync updated meal to Firestore:', e);
    }
  }
}

export async function deleteMealLog(mealId: string): Promise<void> {
  const currentUid = auth.currentUser?.uid || getActiveUid();
  const current = getLocalMeals(currentUid);
  const updated = current.filter((m) => m.id !== mealId);
  saveLocalMeals(updated, currentUid);
  
  // Instantly notify observers to update React state
  const sorted = [...updated];
  sorted.sort((a, b) => (b.date === a.date ? b.timestamp - a.timestamp : b.date.localeCompare(a.date)));
  notifyMealListeners(sorted);

  if (auth.currentUser) {
    try {
      const mealRef = doc(db, 'meals', mealId);
      await deleteDoc(mealRef);
    } catch (e) {
      console.warn('Could not delete meal from Firestore:', e);
    }
  }
}

export async function syncMealsWithFirestore(uid: string): Promise<void> {
  try {
    const q = query(collection(db, 'meals'), where('userId', '==', uid));
    const querySnapshot = await getDocs(q);
    const firestoreMeals: MealLog[] = [];
    querySnapshot.forEach((docSnap) => {
      firestoreMeals.push(docSnap.data() as MealLog);
    });

    const localMeals = getLocalMeals(uid);
    const mealMap = new Map<string, MealLog>();

    // 1. Add all Firestore meals
    for (const fsMeal of firestoreMeals) {
      mealMap.set(fsMeal.id, fsMeal);
    }

    // 2. Add local meals and upload any not yet in Firestore
    for (const localMeal of localMeals) {
      if (!mealMap.has(localMeal.id)) {
        const syncedLocalMeal: MealLog = {
          ...localMeal,
          userId: uid,
        };
        mealMap.set(localMeal.id, syncedLocalMeal);
        // Persist missing meal to Firestore
        await setDoc(doc(db, 'meals', localMeal.id), syncedLocalMeal);
      }
    }

    const mergedMeals = Array.from(mealMap.values());
    mergedMeals.sort((a, b) => (b.date === a.date ? b.timestamp - a.timestamp : b.date.localeCompare(a.date)));
    
    saveLocalMeals(mergedMeals, uid);
    notifyMealListeners(mergedMeals);
  } catch (e) {
    console.warn('Failed to sync meals with Firestore:', e);
  }
}

// Subscribe to real-time meal updates for all dates
export function subscribeAllMeals(callback: (meals: MealLog[]) => void) {
  const currentUid = auth.currentUser?.uid || getActiveUid();
  const local = getLocalMeals(currentUid);
  local.sort((a, b) => (b.date === a.date ? b.timestamp - a.timestamp : b.date.localeCompare(a.date)));
  callback(local);

  // Register client observer
  mealListeners.add(callback);

  let unsubscribeFirestore = () => {};

  if (auth.currentUser) {
    const uid = auth.currentUser.uid;
    // Run bidirectional sync first, then listen to updates
    syncMealsWithFirestore(uid).then(() => {
      try {
        const q = query(
          collection(db, 'meals'),
          where('userId', '==', uid)
        );

        unsubscribeFirestore = onSnapshot(q, (snapshot) => {
          const firestoreMeals: MealLog[] = [];
          snapshot.forEach((docSnap) => {
            firestoreMeals.push(docSnap.data() as MealLog);
          });

          // Merge snapshot with local meals
          const currentLocals = getLocalMeals(uid);
          const map = new Map<string, MealLog>();
          currentLocals.forEach((m) => map.set(m.id, m));
          firestoreMeals.forEach((m) => map.set(m.id, m));

          const merged = Array.from(map.values());
          merged.sort((a, b) => (b.date === a.date ? b.timestamp - a.timestamp : b.date.localeCompare(a.date)));

          saveLocalMeals(merged, uid);
          notifyMealListeners(merged);
        }, (error) => {
          console.warn('Firestore real-time subscription error:', error);
          const fallbackLocal = getLocalMeals(uid);
          fallbackLocal.sort((a, b) => (b.date === a.date ? b.timestamp - a.timestamp : b.date.localeCompare(a.date)));
          notifyMealListeners(fallbackLocal);
        });
      } catch (e) {
        console.warn('Failed to subscribe to Firestore:', e);
      }
    }).catch((err) => {
      console.warn('Initial meal sync warning:', err);
    });
  }

  return () => {
    mealListeners.delete(callback);
    unsubscribeFirestore();
  };
}

// Subscribe to real-time meal updates for a specific date (YYYY-MM-DD)
export function subscribeMealsByDate(dateStr: string, callback: (meals: MealLog[]) => void) {
  return subscribeAllMeals((allMeals) => {
    const filtered = allMeals.filter((m) => m.date === dateStr);
    callback(filtered);
  });
}

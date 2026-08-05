import {
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { db, auth } from '../firebase';
import { UserProfile, WeightEntry, FoodLogEntry, WaterLog } from '../types';

/**
 * Cadastrar novo usuário com Firebase Auth + Firestore
 */
export async function registerUserWithFirebase(
  profileData: Omit<UserProfile, 'id'>,
  passwordText: string
): Promise<UserProfile> {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      profileData.email,
      passwordText
    );
    const uid = userCredential.user.uid;

    const fullProfile: UserProfile = {
      ...profileData,
      id: uid,
    };

    // Salvar perfil no Firestore
    await setDoc(doc(db, 'users', uid), {
      ...fullProfile,
      updatedAt: serverTimestamp(),
    });

    return fullProfile;
  } catch (error: any) {
    console.warn('Firebase auth register error, falling back to local object:', error);
    // If auth fails (e.g. duplicate or auth disabled), return populated user with fallback ID
    const fallbackProfile: UserProfile = {
      ...profileData,
      id: 'usr_' + Date.now().toString(),
    };
    return fallbackProfile;
  }
}

/**
 * Login de usuário com Firebase Auth
 */
export async function loginUserWithFirebase(
  email: string,
  passwordText: string
): Promise<UserProfile | null> {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, passwordText);
    const uid = userCredential.user.uid;

    // Buscar perfil no Firestore
    const userDocRef = doc(db, 'users', uid);
    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
      const data = docSnap.data() as UserProfile;
      // Migration: Map old plans to new ones
      if ((data.plan as any) === 'pro') data.plan = 'beta';
      if ((data.plan as any) === 'premium') data.plan = 'alfa';
      return data;
    } else {
      // Criar documento se não existir
      const defaultProfile: UserProfile = {
        id: uid,
        name: email.split('@')[0] || 'Usuário FocoPeso',
        email,
        password: '',
        age: 28,
        gender: 'masculino',
        currentWeight: 80,
        targetWeight: 75,
        height: 175,
        activityLevel: 1.55,
        goal: 'lose',
        plan: 'free',
        formula: 'mifflin',
        createdAt: new Date().toISOString(),
      };
      await setDoc(userDocRef, {
        ...defaultProfile,
        updatedAt: serverTimestamp(),
      });
      return defaultProfile;
    }
  } catch (error: any) {
    console.warn('Firebase auth login error:', error);
    return null;
  }
}

/**
 * Deslogar do Firebase Auth
 */
export async function logoutFirebase(): Promise<void> {
  try {
    await signOut(auth);
  } catch (e) {
    console.error('Logout error:', e);
  }
}

/**
 * Atualizar / Salvar Perfil do Usuário no Firestore
 */
export async function saveUserProfileToFirestore(user: UserProfile): Promise<void> {
  if (!user.id) return;
  try {
    await setDoc(doc(db, 'users', user.id), {
      ...user,
      updatedAt: serverTimestamp(),
    }, { merge: true });
  } catch (e) {
    console.warn('Firestore save user error:', e);
  }
}

/**
 * Buscar Perfil do Usuário no Firestore
 */
export async function getUserProfileFromFirestore(userId: string): Promise<UserProfile | null> {
  try {
    const docSnap = await getDoc(doc(db, 'users', userId));
    if (docSnap.exists()) {
      const data = docSnap.data() as UserProfile;
      // Migration: Map old plans to new ones
      if ((data.plan as any) === 'pro') data.plan = 'beta';
      if ((data.plan as any) === 'premium') data.plan = 'alfa';
      return data;
    }
  } catch (e) {
    console.warn('Firestore get user error:', e);
  }
  return null;
}

/**
 * Adicionar registro de peso no Firestore
 */
export async function addWeightLogToFirestore(
  userId: string,
  entry: Omit<WeightEntry, 'id'>
): Promise<WeightEntry> {
  const newEntry: WeightEntry = {
    ...entry,
    id: 'w_' + Date.now().toString(),
  };

  try {
    const colRef = collection(db, 'weightLogs');
    await addDoc(colRef, {
      ...newEntry,
      userId,
      createdAt: serverTimestamp(),
    });
  } catch (e) {
    console.warn('Firestore weight log error:', e);
  }

  return newEntry;
}

/**
 * Carregar registros de peso do Firestore
 */
export async function getWeightLogsFromFirestore(userId: string): Promise<WeightEntry[]> {
  try {
    const colRef = collection(db, 'weightLogs');
    const q = query(colRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);

    const logs: WeightEntry[] = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      logs.push({
        id: docSnap.id,
        date: data.date,
        weight: data.weight,
        note: data.note,
      });
    });

    if (logs.length > 0) {
      return logs.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }
  } catch (e) {
    console.warn('Firestore get weight logs error:', e);
  }
  return [];
}

/**
 * Adicionar registro de refeição no Firestore
 */
export async function addFoodLogToFirestore(
  userId: string,
  entry: Omit<FoodLogEntry, 'id'>
): Promise<FoodLogEntry> {
  const newEntry: FoodLogEntry = {
    ...entry,
    id: 'fl_' + Date.now().toString(),
  };

  try {
    const colRef = collection(db, 'foodLogs');
    await addDoc(colRef, {
      ...newEntry,
      userId,
      createdAt: serverTimestamp(),
    });
  } catch (e) {
    console.warn('Firestore food log error:', e);
  }

  return newEntry;
}

/**
 * Buscar diário alimentar do Firestore por data e usuário
 */
export async function getFoodLogsFromFirestore(userId: string, dateStr: string): Promise<FoodLogEntry[]> {
  try {
    const colRef = collection(db, 'foodLogs');
    const q = query(colRef, where('userId', '==', userId), where('date', '==', dateStr));
    const querySnapshot = await getDocs(q);

    const logs: FoodLogEntry[] = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      logs.push({
        id: docSnap.id,
        date: data.date,
        time: data.time,
        name: data.name,
        category: data.category,
        calories: data.calories,
        protein: data.protein,
        carbs: data.carbs,
        fat: data.fat,
      });
    });
    return logs;
  } catch (e) {
    console.warn('Firestore get food logs error:', e);
    return [];
  }
}

/**
 * Salvar registro de água no Firestore
 */
export async function saveWaterLogToFirestore(userId: string, log: WaterLog): Promise<void> {
  try {
    const docRef = doc(db, 'waterLogs', `${userId}_${log.date}`);
    await setDoc(docRef, {
      ...log,
      userId,
      updatedAt: serverTimestamp(),
    });
  } catch (e) {
    console.warn('Firestore water log error:', e);
  }
}

/**
 * Buscar registro de água no Firestore
 */
export async function getWaterLogFromFirestore(userId: string, dateStr: string): Promise<WaterLog | null> {
  try {
    const docRef = doc(db, 'waterLogs', `${userId}_${dateStr}`);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        date: data.date,
        targetMl: data.targetMl,
        consumedMl: data.consumedMl,
      };
    }
  } catch (e) {
    console.warn('Firestore get water log error:', e);
  }
  return null;
}

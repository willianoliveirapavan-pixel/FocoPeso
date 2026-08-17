import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signOut,
  updateProfile,
  User,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { UserProfile } from '../types';
import { DEFAULT_USER_PROFILE, saveLocalProfile } from './storageService';

export function getFriendlyAuthErrorMessage(errorCode: string): string {
  switch (errorCode) {
    case 'auth/invalid-email':
      return 'O endereço de e-mail informado é inválido.';
    case 'auth/user-disabled':
      return 'Esta conta de usuário foi desativada.';
    case 'auth/user-not-found':
      return 'Nenhuma conta encontrada com este e-mail.';
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'E-mail ou senha incorretos. Se você ainda não possui um cadastro, crie sua conta na aba "Criar Conta".';
    case 'auth/email-already-in-use':
      return 'Este e-mail já está cadastrado em outra conta.';
    case 'auth/weak-password':
      return 'A senha deve conter no mínimo 6 caracteres.';
    case 'auth/popup-closed-by-user':
      return 'O login com o Google foi cancelado pelo usuário.';
    case 'auth/network-request-failed':
      return 'Falha na conexão de rede. Verifique sua internet.';
    default:
      return errorCode 
        ? `Ocorreu um erro ao realizar o acesso (${errorCode}). Tente novamente.`
        : 'Ocorreu um erro ao realizar o acesso. Tente novamente.';
  }
}

// Subscribe to Firebase Auth state
export function subscribeAuthState(
  callback: (userProfile: UserProfile | null, rawUser: User | null) => void
) {
  return onAuthStateChanged(auth, async (firebaseUser: User | null) => {
    if (!firebaseUser) {
      callback(null, null);
      return;
    }

    // Load or initialize user profile in Firestore
    const userDocRef = doc(db, 'users', firebaseUser.uid);
    const isAdmin = firebaseUser.email?.toLowerCase().trim() === 'willianoliveirapavan@gmail.com';
    try {
      const snap = await getDoc(userDocRef);
      if (snap.exists()) {
        const profile = snap.data() as UserProfile;
        if (isAdmin) {
          profile.role = 'admin';
          profile.plan = 'beta';
          profile.isPaid = true;
          // Persist the admin role change to the Firestore database
          await setDoc(userDocRef, { role: 'admin', plan: 'beta', isPaid: true }, { merge: true });
        } else {
          profile.isPaid = profile.isPaid ?? false;
        }
        saveLocalProfile(profile);
        callback(profile, firebaseUser);
      } else {
        const newProfile: UserProfile = {
          ...DEFAULT_USER_PROFILE,
          uid: firebaseUser.uid,
          email: firebaseUser.email || 'usuario@focopeso.app',
          name: firebaseUser.displayName || (isAdmin ? 'Admin Willian' : 'Atleta FocoPeso'),
          role: isAdmin ? 'admin' : 'user',
          plan: 'beta',
          isPaid: isAdmin,
        };
        await setDoc(userDocRef, newProfile);
        saveLocalProfile(newProfile);
        callback(newProfile, firebaseUser);
      }
    } catch (err) {
      console.warn('Firestore user doc fetch warning:', err);
      const fallbackProfile: UserProfile = {
        ...DEFAULT_USER_PROFILE,
        uid: firebaseUser.uid,
        email: firebaseUser.email || 'usuario@focopeso.app',
        name: firebaseUser.displayName || (isAdmin ? 'Admin Willian' : 'Atleta FocoPeso'),
        role: isAdmin ? 'admin' : 'user',
        plan: 'beta',
        isPaid: isAdmin,
      };
      saveLocalProfile(fallbackProfile);
      callback(fallbackProfile, firebaseUser);
    }
  });
}

// Sign in with Email and Password
export async function loginWithEmail(email: string, pass: string): Promise<User> {
  const cleanEmail = email.trim().toLowerCase();
  const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, pass);
  return userCredential.user;
}

// Register with Email, Password and Name
export async function registerWithEmail(email: string, pass: string, name: string): Promise<User> {
  const cleanEmail = email.trim().toLowerCase();
  const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, pass);
  const user = userCredential.user;
  const isAdmin = cleanEmail === 'willianoliveirapavan@gmail.com';
  
  if (name.trim()) {
    await updateProfile(user, { displayName: name.trim() });
  }

  // Create initial user document in Firestore
  const userDocRef = doc(db, 'users', user.uid);
  const newProfile: UserProfile = {
    ...DEFAULT_USER_PROFILE,
    uid: user.uid,
    email: user.email || cleanEmail,
    name: name.trim() || (isAdmin ? 'Admin Willian' : 'Atleta FocoPeso'),
    role: isAdmin ? 'admin' : 'user',
    plan: 'beta',
    isPaid: isAdmin,
  };

  await setDoc(userDocRef, newProfile, { merge: true });
  saveLocalProfile(newProfile);

  return user;
}

// Google Sign-In
export async function loginWithGoogle(): Promise<User> {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  const user = result.user;

  // Initialize or update user profile
  const userDocRef = doc(db, 'users', user.uid);
  const snap = await getDoc(userDocRef);
  
  if (!snap.exists()) {
    const newProfile: UserProfile = {
      ...DEFAULT_USER_PROFILE,
      uid: user.uid,
      email: user.email || '',
      name: user.displayName || 'Atleta FocoPeso',
      plan: 'beta',
    };
    await setDoc(userDocRef, newProfile);
    saveLocalProfile(newProfile);
  } else {
    saveLocalProfile(snap.data() as UserProfile);
  }

  return user;
}

// Send Password Reset Email
export async function sendPasswordReset(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email.trim().toLowerCase());
}

// Logout
export async function logoutUser(): Promise<void> {
  const currentUid = auth.currentUser?.uid;
  await signOut(auth);
  localStorage.removeItem('focopeso_user_profile');
  localStorage.removeItem('focopeso_meals_log');
  if (currentUid) {
    localStorage.removeItem(`focopeso_user_profile_${currentUid}`);
    localStorage.removeItem(`focopeso_meals_log_${currentUid}`);
  }
}

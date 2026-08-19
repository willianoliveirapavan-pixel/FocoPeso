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
import {
  DEFAULT_USER_PROFILE,
  saveLocalProfile,
  getLocalProfile,
  syncMealsWithFirestore,
} from './storageService';

export function getFriendlyAuthErrorMessage(errorCode: string): string {
  switch (errorCode) {
    case 'auth/invalid-email':
      return 'O endereço de e-mail informado é inválido.';
    case 'auth/user-disabled':
      return 'Esta conta de usuário foi desativada.';
    case 'auth/user-not-found':
      return 'Nenhuma conta encontrada com este e-mail. Crie uma conta na aba "Criar Conta".';
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
    case 'auth/invalid-login-credentials':
      return 'E-mail ou senha incorretos. Caso tenha esquecido sua senha, use a opção "Esqueceu a senha?" abaixo.';
    case 'auth/email-already-in-use':
      return 'Este e-mail já está cadastrado. Faça login na aba "Entrar" ou recupere sua senha.';
    case 'auth/weak-password':
      return 'A senha deve conter no mínimo 6 caracteres.';
    case 'auth/too-many-requests':
      return 'Muitas tentativas sem sucesso. Aguarde um instante ou redefina sua senha.';
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

// Subscribe to Auth state (supporting Firebase Auth and persistent admin session)
export function subscribeAuthState(
  callback: (userProfile: UserProfile | null, rawUser: User | null) => void
) {
  const checkAuthState = async () => {
    const isBypassActive = localStorage.getItem('focopeso_admin_bypass') === 'true';
    if (isBypassActive) {
      const cached = getLocalProfile('admin_bypass_willian');
      const adminProfile: UserProfile = {
        ...DEFAULT_USER_PROFILE,
        ...cached,
        uid: 'admin_bypass_willian',
        email: 'willianoliveirapavan@gmail.com',
        name: cached.name !== DEFAULT_USER_PROFILE.name ? cached.name : 'Admin Willian',
        role: 'admin',
        plan: 'beta',
        isPaid: true,
        updatedAt: Date.now(),
      };
      saveLocalProfile(adminProfile);
      callback(adminProfile, {
        uid: 'admin_bypass_willian',
        email: 'willianoliveirapavan@gmail.com',
        displayName: adminProfile.name,
        emailVerified: true,
      } as any);
      return;
    }

    const firebaseUser = auth.currentUser;
    if (!firebaseUser) {
      callback(null, null);
      return;
    }

    // Trigger meal synchronization for this user
    syncMealsWithFirestore(firebaseUser.uid).catch((e) => {
      console.warn('Meal sync on auth change warning:', e);
    });

    const userDocRef = doc(db, 'users', firebaseUser.uid);
    const cachedLocal = getLocalProfile(firebaseUser.uid);
    const userEmail = (firebaseUser.email || cachedLocal?.email || '').toLowerCase().trim();
    const isAdmin = userEmail === 'willianoliveirapavan@gmail.com';

    try {
      const snap = await getDoc(userDocRef);
      const local = getLocalProfile(firebaseUser.uid);
      const guestLocal = getLocalProfile('guest');
      const bypassLocal = getLocalProfile('admin_bypass_willian');
      const defaultLocal = getLocalProfile('local_user');

      const candidates = [local, guestLocal, bypassLocal, defaultLocal].filter(
        (p) => p && p.updatedAt && p.updatedAt > 0
      );
      candidates.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
      const activeLocal = candidates[0] || local;

      if (snap.exists()) {
        const firestoreProfile = snap.data() as UserProfile;
        const useLocal = activeLocal && (activeLocal.updatedAt || 0) > (firestoreProfile.updatedAt || 0);
        const profile = useLocal ? { ...activeLocal, uid: firebaseUser.uid } : { ...firestoreProfile };

        if (isAdmin) {
          profile.role = 'admin';
          profile.plan = 'beta';
          profile.isPaid = true;
          if (!profile.email) profile.email = 'willianoliveirapavan@gmail.com';
        } else {
          profile.isPaid = profile.isPaid ?? false;
        }

        if (useLocal) {
          setDoc(userDocRef, { ...profile, uid: firebaseUser.uid }, { merge: true }).catch(console.warn);
        } else if (isAdmin) {
          setDoc(userDocRef, { role: 'admin', plan: 'beta', isPaid: true }, { merge: true }).catch(console.warn);
        }

        saveLocalProfile(profile);
        callback(profile, firebaseUser);
      } else {
        const newProfile: UserProfile = {
          ...DEFAULT_USER_PROFILE,
          ...activeLocal,
          uid: firebaseUser.uid,
          email: firebaseUser.email || cleanEmailForUser(firebaseUser) || (isAdmin ? 'willianoliveirapavan@gmail.com' : 'usuario@focopeso.app'),
          name: firebaseUser.displayName || activeLocal.name || (isAdmin ? 'Admin Willian' : 'Atleta FocoPeso'),
          role: isAdmin ? 'admin' : 'user',
          plan: 'beta',
          isPaid: isAdmin,
          updatedAt: Date.now(),
        };
        await setDoc(userDocRef, newProfile).catch(console.warn);
        saveLocalProfile(newProfile);
        callback(newProfile, firebaseUser);
      }
    } catch (err) {
      console.warn('Firestore user doc fetch fallback:', err);
      const cached = getLocalProfile(firebaseUser.uid);
      const fallbackProfile: UserProfile = {
        ...DEFAULT_USER_PROFILE,
        ...cached,
        uid: firebaseUser.uid,
        email: firebaseUser.email || cached.email || (isAdmin ? 'willianoliveirapavan@gmail.com' : 'usuario@focopeso.app'),
        name: firebaseUser.displayName || cached.name || (isAdmin ? 'Admin Willian' : 'Atleta FocoPeso'),
        role: isAdmin ? 'admin' : cached.role || 'user',
        plan: 'beta',
        isPaid: isAdmin || cached.isPaid,
      };
      saveLocalProfile(fallbackProfile);
      callback(fallbackProfile, firebaseUser);
    }
  };

  // Custom events listener
  const handleCustomAuthChange = () => {
    checkAuthState();
  };
  window.addEventListener('focopeso_auth_changed', handleCustomAuthChange);

  // Firebase auth state listener
  const unsubscribeFirebase = onAuthStateChanged(auth, async (firebaseUser: User | null) => {
    if (localStorage.getItem('focopeso_admin_bypass') === 'true') {
      checkAuthState();
      return;
    }

    if (!firebaseUser) {
      callback(null, null);
      return;
    }

    checkAuthState();
  });

  // Initial trigger
  checkAuthState();

  return () => {
    unsubscribeFirebase();
    window.removeEventListener('focopeso_auth_changed', handleCustomAuthChange);
  };
}

function cleanEmailForUser(user: User): string {
  return user.email || '';
}

// Sign in with Email and Password
export async function loginWithEmail(email: string, pass: string): Promise<User> {
  const cleanEmail = email.trim().toLowerCase();
  const isAdmin = cleanEmail === 'willianoliveirapavan@gmail.com';

  if (!cleanEmail) {
    throw new Error('Informe um e-mail válido.');
  }
  if (!pass) {
    throw new Error('Informe sua senha.');
  }

  // 1. Standard Firebase email & password sign-in
  try {
    const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, pass);
    localStorage.removeItem('focopeso_admin_bypass');
    window.dispatchEvent(new Event('focopeso_auth_changed'));
    return userCredential.user;
  } catch (error: any) {
    console.warn('signInWithEmailAndPassword warning:', error?.code);

    // 2. Admin fallback: If password mismatch or user not in auth, grant access
    if (isAdmin) {
      try {
        const createCredential = await createUserWithEmailAndPassword(auth, cleanEmail, pass);
        localStorage.removeItem('focopeso_admin_bypass');
        window.dispatchEvent(new Event('focopeso_auth_changed'));
        return createCredential.user;
      } catch (adminCreateErr) {
        localStorage.setItem('focopeso_admin_bypass', 'true');
        const adminProfile: UserProfile = {
          ...DEFAULT_USER_PROFILE,
          uid: 'admin_bypass_willian',
          email: 'willianoliveirapavan@gmail.com',
          name: 'Admin Willian',
          role: 'admin',
          plan: 'beta',
          isPaid: true,
          updatedAt: Date.now(),
        };
        saveLocalProfile(adminProfile);
        window.dispatchEvent(new Event('focopeso_auth_changed'));
        return {
          uid: 'admin_bypass_willian',
          email: 'willianoliveirapavan@gmail.com',
          displayName: 'Admin Willian',
          emailVerified: true,
        } as any;
      }
    }

    // 3. Regular users: If not found, try creating account automatically
    if (error?.code === 'auth/user-not-found') {
      try {
        const createCredential = await createUserWithEmailAndPassword(auth, cleanEmail, pass);
        localStorage.removeItem('focopeso_admin_bypass');
        window.dispatchEvent(new Event('focopeso_auth_changed'));
        return createCredential.user;
      } catch (createErr: any) {
        throw createErr;
      }
    }

    // If credential was invalid, check if account is not registered yet
    if (
      error?.code === 'auth/invalid-credential' ||
      error?.code === 'auth/invalid-login-credentials' ||
      error?.code === 'auth/wrong-password'
    ) {
      try {
        const createCredential = await createUserWithEmailAndPassword(auth, cleanEmail, pass);
        localStorage.removeItem('focopeso_admin_bypass');
        window.dispatchEvent(new Event('focopeso_auth_changed'));
        return createCredential.user;
      } catch (createErr: any) {
        // If email already in use, throw a clear friendly wrong password error
        if (createErr?.code === 'auth/email-already-in-use') {
          throw new Error('auth/wrong-password');
        }
        throw createErr;
      }
    }

    throw error;
  }
}

// Register with Email, Password and Name
export async function registerWithEmail(email: string, pass: string, name: string): Promise<User> {
  const cleanEmail = email.trim().toLowerCase();
  const isAdmin = cleanEmail === 'willianoliveirapavan@gmail.com';

  if (!cleanEmail) {
    throw new Error('Informe um e-mail válido.');
  }
  if (!pass || pass.length < 6) {
    throw new Error('auth/weak-password');
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, pass);
    const user = userCredential.user;
    
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
      updatedAt: Date.now(),
    };

    await setDoc(userDocRef, newProfile, { merge: true }).catch(console.warn);
    saveLocalProfile(newProfile);
    localStorage.removeItem('focopeso_admin_bypass');
    window.dispatchEvent(new Event('focopeso_auth_changed'));

    return user;
  } catch (error: any) {
    if (error?.code === 'auth/email-already-in-use') {
      try {
        const signCredential = await signInWithEmailAndPassword(auth, cleanEmail, pass);
        if (name.trim() && !signCredential.user.displayName) {
          await updateProfile(signCredential.user, { displayName: name.trim() });
        }
        localStorage.removeItem('focopeso_admin_bypass');
        window.dispatchEvent(new Event('focopeso_auth_changed'));
        return signCredential.user;
      } catch (signInErr: any) {
        if (isAdmin) {
          localStorage.setItem('focopeso_admin_bypass', 'true');
          const adminProfile: UserProfile = {
            ...DEFAULT_USER_PROFILE,
            uid: 'admin_bypass_willian',
            email: 'willianoliveirapavan@gmail.com',
            name: name.trim() || 'Admin Willian',
            role: 'admin',
            plan: 'beta',
            isPaid: true,
            updatedAt: Date.now(),
          };
          saveLocalProfile(adminProfile);
          window.dispatchEvent(new Event('focopeso_auth_changed'));
          return {
            uid: 'admin_bypass_willian',
            email: 'willianoliveirapavan@gmail.com',
            displayName: adminProfile.name,
            emailVerified: true,
          } as any;
        }
        throw new Error('auth/email-already-in-use');
      }
    }
    throw error;
  }
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
    await setDoc(userDocRef, newProfile).catch(console.warn);
    saveLocalProfile(newProfile);
  } else {
    saveLocalProfile(snap.data() as UserProfile);
  }

  window.dispatchEvent(new Event('focopeso_auth_changed'));
  return user;
}

// Send Password Reset Email
export async function sendPasswordReset(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email.trim().toLowerCase());
}

// Logout
export async function logoutUser(): Promise<void> {
  localStorage.removeItem('focopeso_admin_bypass');
  await signOut(auth);
  window.dispatchEvent(new Event('focopeso_auth_changed'));
  // NOTE: We deliberately preserve cached meals and user profile data in localStorage
  // so that offline continuity is maintained and data is never accidentally wiped upon logging out.
}

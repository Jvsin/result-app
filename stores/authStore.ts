// src/stores/authStore.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { type IUser, UserModel } from '~/models/user';
import { DocumentReference, getFirestore, doc, setDoc } from 'firebase/firestore';
// import { auth, db } from '@/firebaseConfig';

export const useAuthStore = defineStore('auth', () => {
  const auth = getAuth();
  const user = ref(null);
  const loggedUserData = ref(null)
  const loading = ref(false);
  const error = ref<string | null>(null);

  const db = getFirestore();

  const registerWithPassword = async (email: string, password: string, userData: IUser) => {
    loading.value = true;
    error.value = null;

    let createdUserRef: DocumentReference | null

    try {
      console.log("Registering user with email:", email);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      user.value = userCredential.user;
      console.log("User registered:", user.value);

      const userDocRef = doc(db, "users", userCredential.user.uid);
      await setDoc(userDocRef, userData);
      console.log("User data saved to Firestore:", userData);

    } catch (err: any) {
      console.log("Error during registration:", err);
      if (err.code === 'auth/email-already-in-use') {
        error.value = 'registerErrorEmailInUse';
      } else {
        error.value = 'registerErrorBasic';
      }
    } finally {
      loading.value = false;
    }
  };

  const loginWithPassword = async (email: string, password: string) => {
    loading.value = true;
    error.value = null;
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      user.value = userCredential.user;
    } catch (err: any) {
      console.log("Error during registration:", err);
      if (err.code === 'auth/invalid-credential') {
        error.value = 'loginErrorInvalidCredential';
      } else {
        error.value = 'loginErrorBasic';
      }
    } finally {
      loading.value = false;
    }
  };

  const logout = async () => {
    loading.value = true;
    error.value = null;
    try {
      await signOut(auth);
      user.value = null;
    } catch (err: any) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  return { user, loading, error, registerWithPassword, loginWithPassword, logout };
});

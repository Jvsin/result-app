// src/stores/authStore.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { type IUser, UserModel } from '~/models/user';
import { DocumentReference, getFirestore, doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
// import { auth, db } from '@/firebaseConfig';

export const useAuthStore = defineStore('auth', () => {
  const auth = getAuth();
  const user = ref(null);
  const loggedUserData = ref<UserModel | null>(null)
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

      if (userCredential) {
        console.log("wszedłem")
        await fetchUserData(userCredential.user.uid)

        if (process.client && loggedUserData.value) {
          localStorage.setItem('loggedUserData', JSON.stringify(loggedUserData.value));
        }
      }

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
      console.log(userCredential.user.uid)
      await fetchUserData(userCredential.user.uid)

      if (process.client && loggedUserData.value) {
        console.log("zapisuje dane do local storage")
        const dataToStore = {
          userData: loggedUserData.value,
          timestamp: new Date().getTime()
        };

        localStorage.setItem('loggedUserData', JSON.stringify(dataToStore));
        console.log(localStorage.getItem('loggedUserData'))
      }

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
      loggedUserData.value = null
      console.log(loggedUserData.value + ' ' + user.value)

      if (process.client) {
        localStorage.removeItem('loggedUserData');
      }
    } catch (err: any) {
      error.value = err.message;
      console.log(error.value)
    } finally {
      loading.value = false;
    }
  };

  const fetchUserData = async (uid: string) => { 
    loading.value = true;
    error.value = null;
    try {
      const userDocRef = doc(db, "users", uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const userData = userDoc.data() as IUser;
        loggedUserData.value = new UserModel(userData, userDocRef);
      } else {
        error.value = "User data not found";
        // loggedUserData.value = null;
      }
    } catch (err: any) {
      error.value = err.message;
      console.log(err)
      // loggedUserData.value = null;
    } finally {
      // loading.value = false;
    }
  }

  const editProfile = async (data: any) => {
    try {
      const userDocRef = doc(db, 'users', loggedUserData.value?.reference?.id);
      await updateDoc(userDocRef, data);
      console.log('User profile updated successfully');
      await fetchUserData(data.uid)
      console.log(loggedUserData)
    } catch (error) { 
      console.error('Error updating user profile:', error);
    }
  }

  const deleteFavLeague = async (data: any) => {
    try {
      const userDocRef = doc(db, 'users', loggedUserData.value?.reference?.id);
      await updateDoc(userDocRef, data);
      console.log('User profile updated successfully');
      await fetchUserData(data.uid)
      console.log(loggedUserData)
    } catch (error) { 
      console.error('Error updating user profile:', error);
    }
  }

  const loadUserDataFromLocalStorage = async () => {
    if (process.client) {
      console.log("wchodze tak")
      const savedUserData = localStorage.getItem('loggedUserData');
      // if (savedUserData) {
      //   const parsedData = JSON.parse(savedUserData)
      //   loggedUserData.value = parsedData.userData;
      // }
      console.log(savedUserData)
      if (savedUserData) {
        const parsedData = JSON.parse(savedUserData);
        const currentTime = new Date().getTime();
        const dataAge = currentTime - parsedData.timestamp;
        const maxAge = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

        if (dataAge < maxAge) {
          loggedUserData.value = parsedData.userData;
          console.log("Loaded user data from local storage", loggedUserData.value);
        } else {
          localStorage.removeItem('loggedUserData');
          console.log("User data expired and was removed from local storage");
        }
      }
    }
  };

   const initializeAuth = async () => {
    return new Promise<void>((resolve) => {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          user.value = user;
          await fetchUserData(user.uid);
        } else {
          user = null;
          loggedUserData.value = null;
        }
        resolve();
      });
    });
  };

  loadUserDataFromLocalStorage();

  return {
    user, loading, error, loggedUserData,
    fetchUserData, registerWithPassword,
    loginWithPassword, logout, editProfile, deleteFavLeague,
    loadUserDataFromLocalStorage, initializeAuth
  };
});

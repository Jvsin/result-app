// src/stores/authStore.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { type IUser, UserModel } from '~/models/user';
import { DocumentReference, getFirestore, doc, setDoc, getDoc, updateDoc, collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { useBetStore } from './betStore';
import { useBetLeagueStore } from './betLeaguesStore';
import { useInvitationStore } from './invitationStore';
// import { auth, db } from '@/firebaseConfig';

export const useAuthStore = defineStore('auth', () => {
  const auth = getAuth();
  const user = ref(null);
  const loggedUserData = ref<UserModel | null>(null)
  const loading = ref(false);
  const error = ref<string | null>(null);

  const db = getFirestore();
  const betStore = useBetStore()
  const betLeagueStore = useBetLeagueStore()
  const invitationStore = useInvitationStore()

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
        await fetchUserData(userCredential.user.uid)
      }

      // const betsCollectionRef = collection(userDocRef, "bets");
      // await addDoc(betsCollectionRef, {})

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
    loading.value = true
    error.value = null
    try {
      await signOut(auth);
      user.value = null;
      loggedUserData.value = null
      
      await betStore.handleLogout()
      await betLeagueStore.handleLogout()
      await invitationStore.handleLogout()

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

  const actualizeUserData = async () => {
    try {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (currentUser) {
      const uid = currentUser.uid;
      const userDocRef = doc(db, "users", uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const userData = userDoc.data() as IUser;
        loggedUserData.value = new UserModel(userData, userDocRef);
      } else {
        error.value = "User data not found";
        loggedUserData.value = null;
      }
    } else {
      error.value = "No authenticated user found";
      loggedUserData.value = null;
    }
  } catch (err: any) {
    error.value = err.message;
    console.log(err);
    loggedUserData.value = null;
  } finally {
    loading.value = false;
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

  const addNewBetLeague = async (data: DocumentReference) => {
    try {
      const userDocRef = doc(db, 'users', loggedUserData.value?.reference?.id)

      if (loggedUserData.value?.leagues != undefined) {
        const updatedFavLeagues = [...loggedUserData.value?.leagues, data]
        console.log(updatedFavLeagues)
        
        await updateDoc(userDocRef, {
          leagues: updatedFavLeagues
        });
      }
      
      console.log('User bet leagues actualized!');
      await actualizeUserData()
      console.log(loggedUserData)
    } catch (error) { 
      console.error('Error updating user profile:', error);
    }
  }

  const fetchLeaguePlayers = async (playerRefs: DocumentReference[]) => {
    const players = [];

    for (const playerRef of playerRefs) {
      try {
        const playerDoc = await getDoc(playerRef);

        if (playerDoc.exists()) {
          const { nick, polPoints, betAcc } = playerDoc.data();
          players.push({
            nick,
            polPoints,
            betAcc,
            playerRef
          });
        }
        console.log(players)
      } catch (error) {
        console.error(`Failed to fetch player data for ref: ${playerRef.id}`, error);
      }
    }
    return players
  }

  const fetchUserByRef = async (userRef: DocumentReference) => {
    try {
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const userData = userDoc.data() as IUser;
        return userData
      } else {
        error.value = "User data not found";
        return null
      }
    } catch (error) {
        console.error("Error getting documents: ", error);
        throw new Error("Failed to get user");
    }
  }

  const fetchUserByCode = async (code: string): Promise<UserModel[]> => {
    try {
      const usersRef = collection(db, 'users')
      const usersQuery = query(
        usersRef,
        where('userCode', '==', code)
        // where('nick', '>=', nick),
        // where('nick', '<=', nick + '\uf8ff'),
      )
      
      const users: UserModel[] = []
      const querySnapshot = await getDocs(usersQuery)
      querySnapshot.forEach((doc) => {
        const userData = doc.data() as IUser
        if (loggedUserData.value?.reference?.id === doc.id) {
          invitationStore.alertMess = 'cannotInviteYourself'
          return null
        }
        console.log(userData)
        const user = new UserModel(userData, doc.ref)
        users.push(user)
      })
      console.log(users)
      return users || null
    } catch (error) {
      console.error("Error getting documents: ", error);
      throw new Error("Failed to get user");
    }   
  }

  return {
    user, loading, error, loggedUserData, fetchUserData, actualizeUserData,
    registerWithPassword, loginWithPassword, logout, editProfile, deleteFavLeague,
    fetchLeaguePlayers, fetchUserByRef, fetchUserByCode, addNewBetLeague
  };
});

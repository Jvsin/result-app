import { defineStore } from 'pinia'
import { LeagueModel, type ILeague } from '~/models/betLeague'
import {
  addDoc, collection, doc, getDocs, getFirestore, query, updateDoc, where,
  type DocumentReference, orderBy, limit,
  getDoc,
  setDoc,
  runTransaction,
  arrayRemove
} from 'firebase/firestore';
import { useAuthStore } from './authStore';
import { getAuth } from 'firebase/auth';
import { errorMessages } from 'vue/compiler-sfc';
import type { InvitationModel } from '~/models/invitation';

export const useBetLeagueStore = defineStore('betLeagues', () => {
  const db = getFirestore()
  const userBetLeagues = ref<LeagueModel[] >([])
  const leagueToDisplay = ref<LeagueModel>()

  const authStore = useAuthStore()
  const playersTable = ref<any>()

  const mess = ref('')

  const fetchUserBetLeagues = async (userLeagues: DocumentReference[]) => {
    try {
      const leagues: LeagueModel[] = [];

      for (const leagueRef of userLeagues) {
        const leagueSnapshot = await getDoc(leagueRef);

        if (leagueSnapshot.exists()) {
          const leagueData = leagueSnapshot.data() as ILeague;
          if (!userBetLeagues.value.find((l: LeagueModel) => l.leagueCode === leagueData.leagueCode)) {
            const data = new LeagueModel(leagueData, leagueSnapshot.ref)
            console.log(data)
            userBetLeagues.value.push(data)
          }
        }
      }
    }
    catch (e) {
      console.error('error', e)
    }
  }

  const fetchLeagueById = async (leagueId: string) => {
    try {
      const league = userBetLeagues.value.find((l: LeagueModel) => l.reference.id === leagueId);
      if (league) {
        leagueToDisplay.value = league
        return
      }
      else {
        const docRef = doc(db, "leagues", leagueId);
        const leagueDoc = await getDoc(docRef);

        if (leagueDoc.exists()) {
          const leagueData = leagueDoc.data() as ILeague
          const data = new LeagueModel(leagueData, leagueDoc.ref)
          if (!userBetLeagues.value.find((l: LeagueModel) => l.leagueCode === leagueData.leagueCode)) {
            console.log(data)
            userBetLeagues.value.push(data)
          }
          leagueToDisplay.value = data
        } else {
          console.error("League not found")
          return null;
        }
        // return league;
      }  
    } catch (error) {
      console.error("Error fetching league:", error);
      return null;
    }
  }

  const fetchLeagueByCode = async (code: string) => {
    mess.value = ''
    try {
      const leaguesRef = collection(db, 'leagues')
      const leaguesQuery = query(
        leaguesRef,
        where('leagueCode', '==', code),
        where('isPublic', '==', true)
      )
      const querySnapshot = await getDocs(leaguesQuery)
      const leagueDoc = querySnapshot.docs[0]

      if (leagueDoc) {
        const leagueData = leagueDoc.data() as ILeague
        const data = new LeagueModel(leagueData, leagueDoc.ref)
        return data
      } else {
        console.error("League not found")
        mess.value = 'leagueNotFound'
        return null;
      }
    } catch (error) {
      console.error("Error fetching league:", error);
      return null;
    }
  }

  const fetchLeaguesByInvitations = async (invitations: DocumentReference[]) => {
    mess.value = ''
    try {
      const promises = invitations.map(async (invite) => {
        console.log(invite)
        const docRef = doc(db, 'leagues', invite.id)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
            return new LeagueModel(docSnap.data() as ILeague, invite) 
        } else {
          throw new Error(`Document with reference ${invite} does not exist`);
        }
      })
      const allLeaguesInvitations = await Promise.all(promises)
      console.log(allLeaguesInvitations)
      return allLeaguesInvitations
    } catch (error) {
      console.error("Error fetching league:", error);
      return null;
    }
  }

  const joinLeague = async (league: LeagueModel) => {
    try {
      mess.value = ''
      const auth = getAuth()
      const userRef = authStore.loggedUserData?.reference
      if (userRef == undefined) {
        throw new Error("User fetch error")
      }
      const docRef = doc(db, "leagues", league.reference.id)

      await runTransaction(db, async (transaction) => {
        const leagueDoc = await transaction.get(docRef);
        if (!leagueDoc.exists()) {
          throw new Error("League does not exist!");
        }

        const players = leagueDoc.data().players || [];
        
        const userExists = players.some((ref: DocumentReference) => ref.id === userRef.id);

        if (userExists) {
          mess.value = "alreadyJoinedToLeague";
          throw new Error("alreadyJoinedToLeague")
        }

        players.push(userRef);

        transaction.update(docRef, { players: players })

        const userLeagues = authStore.loggedUserData?.leagues || []

        const leagueExists = userLeagues.some((ref: DocumentReference) => ref.id === docRef.id)
        if (!leagueExists) {
          userLeagues.push(docRef)
          console.log(userLeagues)
          const userLeagueActualization = {
            leagues: userLeagues
          }
          await authStore.editProfile(userLeagueActualization)
        }
        else {
          mess.value = "alreadyJoinedToLeague";
          throw new Error("alreadyJoinedToLeague");
        }
      });
    } catch (e) {
      console.log(e)
    }
  }

  const leaveLeague = async (leagueRef: DocumentReference) => {
    try {
      const userRef = authStore.loggedUserData?.reference
      if (userRef == undefined) {
        throw new Error("User fetch error")
      }

      await updateDoc(leagueRef, {
        players: arrayRemove(userRef)
      })

      await updateDoc(userRef, {
        leagues: arrayRemove(leagueRef)
      })
      
      userBetLeagues.value = userBetLeagues.value.filter((league: LeagueModel) => league.reference !== leagueRef)
      console.log("Successfully left the league")
    }
    catch (err) {
      console.error(err)
    }
  }

  const deletePlayerFromLeague = async (userRef: DocumentReference, league: LeagueModel) => {
    try {
      await updateDoc(league.reference, {
        players: arrayRemove(userRef)
      });
      await updateDoc(userRef, {
        leagues: arrayRemove(league.reference)
      })
      console.log("User deleted correctly")
      mess.value = 'userDeleted'
      await actualizeLeagueData(league.reference)
    }
    catch (err) {
      console.error(err)
    }
  }

  const actualizeLeagueData = async (leagueId: DocumentReference) => {
    try {
      const docRef = doc(db, "leagues", leagueId)
      const leagueDoc = await getDoc(docRef);

      if (leagueDoc.exists()) {
        const leagueData = leagueDoc.data() as ILeague
        const data = new LeagueModel(leagueData, leagueDoc.ref)
        
        const leagueToChange = userBetLeagues.value.find((l: LeagueModel) => l.leagueCode === leagueData.leagueCode)
        if (!leagueToChange) {
          console.log(data)
          userBetLeagues.value.push(data)
        } else {
          userBetLeagues.value[leagueToChange] = data
        }
        leagueToDisplay.value = data
      } else {
        console.error("League not found")
        return null;
      }
    } catch (e) {
      console.log(e)
    }
  }

  const fetchPlayersData = async (playersData: DocumentReference[]) => {
    const players = await authStore.fetchLeaguePlayers(playersData)
    console.log(players)

    players.sort((a, b) => {
      if (b.polPoints !== a.polPoints) {
        return b.polPoints - a.polPoints; 
      }

      return b.betAcc - a.betAcc; 
    })
    console.log(players)
    playersTable.value = players
  }

  const editLeagueData = async (data: any, ref: string) => {
    try {
      const userDocRef = doc(db, `leagues/${ref}`);
      console.log(userDocRef)
      await updateDoc(userDocRef, data);
      console.log('League updated successfully');

      const updatedDoc = await getDoc(userDocRef)
      if (updatedDoc.exists()) {
        userBetLeagues.value.forEach((league: any) => console.log(league.reference.id))
        const leagueData = updatedDoc.data() as ILeague
        const existingIndex = userBetLeagues.value.findIndex((l: any) => l.reference.id === updatedDoc.ref.id)
        
        const newData = new LeagueModel(leagueData, updatedDoc.ref)
        if (!existingIndex) {
          userBetLeagues.value.push(newData)
        }
        else {
          userBetLeagues.value[existingIndex] = newData
        }
        leagueToDisplay.value = newData
      }
    } catch (error) { 
      console.error('Error updating league data:', error);
    }
  }

  const createLeague = async (league: any) => {
    mess.value = ''

    try {
      const docRef = await addDoc(collection(db, "leagues"), league)
      mess.value = 'successfulLeagueCreation'

      await authStore.addNewBetLeague(docRef)
    } catch (err) {
      mess.value = 'errorCreatingLeague'
      console.error("Error while creating league: ", err);
    }
  }

  const generateCode = (): string => {
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters[randomIndex];
    }
    return result;
  }

  const checkIfCodeExists = async (code: string): Promise<boolean> => {
    const leaguesRef = collection(db, "leagues");
    const q = query(leaguesRef, where("leagueCode", "==", code));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  }

  const handleLogout = async () => {
    userBetLeagues.value = []
    leagueToDisplay.value = undefined
    playersTable.value = null
  }

  const generateUniqueLeagueCode = async (): Promise<string | undefined> => {
    let code;
    let exists = true;

    while (exists) {
      code = generateCode();
      exists = await checkIfCodeExists(code);
    }

    return code
  }

  return {
    userBetLeagues, leagueToDisplay, playersTable, mess,
    fetchUserBetLeagues, fetchLeagueById, fetchPlayersData, editLeagueData, deletePlayerFromLeague, actualizeLeagueData,
    generateUniqueLeagueCode, createLeague, fetchLeagueByCode, joinLeague, leaveLeague, 
    fetchLeaguesByInvitations,
    handleLogout
  }
})

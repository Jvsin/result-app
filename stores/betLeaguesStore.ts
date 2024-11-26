import { defineStore } from 'pinia'
import { LeagueModel, type ILeague } from '~/models/betLeague'
import {
  addDoc, collection, doc, getDocs, getFirestore, query, updateDoc, where,
  type DocumentReference, orderBy, limit,
  getDoc
} from 'firebase/firestore';
import { useAuthStore } from './authStore';

export const useBetLeagueStore = defineStore('betLeagues', () => {
  const db = getFirestore()
  const userBetLeagues = ref<LeagueModel[] >([])
  const leagueToDisplay = ref<LeagueModel>()

  const authStore = useAuthStore()
  const playersTable = ref<any>()

  const fetchUserBetLeagues = async (userLeagues: DocumentReference[]) => {
    try {
      const leagues: LeagueModel[] = [];

      for (const leagueRef of userLeagues) {
        const leagueSnapshot = await getDoc(leagueRef);

        if (leagueSnapshot.exists()) {
          const leagueData = leagueSnapshot.data() as ILeague;
          if (!userBetLeagues.value.find(l => l.leagueCode === leagueData.leagueCode)) {
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
      const league = userBetLeagues.value.find((l) => l.reference.id === leagueId);

      const docRef = doc(db, "leagues", leagueId);
      const leagueDoc = await getDoc(docRef);

      if (leagueDoc.exists()) {
        const leagueData = leagueDoc.data() as ILeague
        const data = new LeagueModel(leagueData, leagueDoc.ref)
        if (!userBetLeagues.value.find(l => l.leagueCode === leagueData.leagueCode)) {
          console.log(data)
          userBetLeagues.value.push(data)
        }
        leagueToDisplay.value = data
        // return league;
      } else {
        console.error("League not found")
        return null;
      }
    } catch (error) {
      console.error("Error fetching league:", error);
      return null;
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
      await fetchLeagueById(ref)
      
    } catch (error) { 
      console.error('Error updating league data:', error);
    }
  }

  const handleLogout = async () => {
    userBetLeagues.value = []
    leagueToDisplay.value = undefined
    playersTable.value = null
  }

  return {
    userBetLeagues, leagueToDisplay, playersTable,
    fetchUserBetLeagues, fetchLeagueById, fetchPlayersData, editLeagueData, 
    handleLogout
  }
})

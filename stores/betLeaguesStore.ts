import { defineStore } from 'pinia'
import { LeagueModel, type ILeague } from '~/models/betLeague'
import {
  addDoc, collection, doc, getDocs, getFirestore, query, updateDoc, where,
  type DocumentReference, orderBy, limit,
  getDoc
} from 'firebase/firestore';

export const useBetLeagueStore = defineStore('betLeagues', () => {
  const db = getFirestore()
  const userBetLeagues = ref<LeagueModel[]>([])
  const leagueToDisplay = ref<LeagueModel>()

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
      if (league) {
        leagueToDisplay.value = league
        // return league;
      }

      const docRef = doc(db, "leagues", leagueId);
      const leagueDoc = await getDoc(docRef);

      if (leagueDoc.exists()) {
        const leagueData = leagueDoc.data() as ILeague;
        const league = new LeagueModel(leagueData, leagueDoc.ref);
        userBetLeagues.value.push(league)
        leagueToDisplay.value = league
        // return league;
      } else {
        console.error("League not found")
        return null;
      }
    } catch (error) {
      console.error("Error fetching league:", error);
      return null;
    }
  };

  return {
    userBetLeagues, leagueToDisplay,
    fetchUserBetLeagues, fetchLeagueById
  }
})

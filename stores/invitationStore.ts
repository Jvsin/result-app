import { defineStore } from 'pinia'
import { InvitationModel, type IInvitation } from '~/models/invitation';
import {
  addDoc, collection, doc, getDocs, getFirestore, query, updateDoc, where,
  type DocumentReference, orderBy, limit,
  getDoc
} from 'firebase/firestore';
import { useAuthStore } from './authStore';

export const useInvitationStore = defineStore('invitations', () => { 
  const db = getFirestore()

  const leagueInvitations = ref<InvitationModel[]>()
  
  const fetchAllLeagueInvitations = async (leagueRef: DocumentReference) => {
    try {
      const invitationsRef = collection(db, 'invitations');
      console.log(invitationsRef)
      const q = query(invitationsRef, where('leagueReference', '==', leagueRef));
        
      const querySnapshot = await getDocs(q);
      
      const invitations: InvitationModel[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data() as IInvitation
          console.log(data)
          invitations.push(new InvitationModel(data, doc.ref));
        });
        
      leagueInvitations.value = invitations
    } catch (error) {
        console.error("Error getting documents: ", error);
        throw new Error("Failed to get invitations");
    }
  }

  return { 
    leagueInvitations,
    fetchAllLeagueInvitations
  }
})

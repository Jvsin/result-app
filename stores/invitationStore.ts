import { defineStore } from 'pinia'
import { InvitationModel, type IInvitation } from '~/models/invitation';
import {
  addDoc, collection, doc, getDocs, getFirestore, query, updateDoc, where,
  type DocumentReference, orderBy, limit,
  getDoc,
  deleteDoc
} from 'firebase/firestore';
import { useAuthStore } from './authStore';
import { useBetLeagueStore } from './betLeaguesStore';
import type { LeagueModel } from '~/models/betLeague';

export const useInvitationStore = defineStore('invitations', () => { 
  const db = getFirestore()
  const betLeagueStore = useBetLeagueStore()

  const allUserInvitations = ref<InvitationModel[]>()

  const alertMess = ref('')
  
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
        
      allUserInvitations.value = invitations
    } catch (error) {
        console.error("Error getting documents: ", error);
        throw new Error("Failed to get invitations");
    }
  }

  const fetchAllUserInvitations = async (userRef: DocumentReference) => {
    try {
      const invitationsRef = collection(db, 'invitations');
      console.log(invitationsRef)
      const q = query(invitationsRef, where('user', '==', userRef));
        
      const querySnapshot = await getDocs(q);
      
      const invitations: InvitationModel[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data() as IInvitation
          console.log(data)
          invitations.push(new InvitationModel(data, doc.ref));
        });
        
      allUserInvitations.value = invitations
    } catch (error) {
        console.error("Error getting documents: ", error);
        throw new Error("Failed to get invitations");
    }
  }

  const sendInviteToUser = async (invitation: IInvitation) => {
    try {
      const invitationsRef = collection(db, "invitations")
      const q = query(invitationsRef, where("user", "==", invitation.user),
        where("leagueCode", "==", invitation.leagueCode))
      const querySnapshot = await getDocs(q)

      if (!querySnapshot.empty) {
        console.log("User has already been invited to this league.")
        alertMess.value = 'invitationAlreadySended'
        return
      }

      await addDoc(invitationsRef, invitation);
      console.log("Invitation sent successfully.");
      alertMess.value = 'invitationSendCorrectly'
    } catch (error) {
      console.error("Error sending invitation: ", error);
    }
  }

  const acceptInvitation = async (league: LeagueModel, invitationRef: DocumentReference) => {
    try {
      await betLeagueStore.joinLeague(league)
      allUserInvitations.value =allUserInvitations.value.filter((invite: InvitationModel) => invite.leagueReference.id != league.reference.id)
      await deleteDoc(invitationRef)
      alertMess.value = 'invitationAccepted'
      console.log('Invitation accepted correctly!')
    }
    catch (e) {
      console.log(e)
    }
  }

  const deleteInvitation = async (invitationRef: DocumentReference) => {
    try {
      alertMess.value = ''
      allUserInvitations.value = allUserInvitations.value.filter((invite: InvitationModel) => invite.reference.id != invitationRef.id)
      console.log(allUserInvitations)
      await deleteDoc(invitationRef)
      alertMess.value = 'invitationDeleted'
      //ustawiać flage na false i zostawiać 
      console.log('Invitation deleted!')
    }
    catch (e) {
      console.log(e)
    }
  }

  const handleLogout = () => {
    allUserInvitations.value = null
    alertMess.value = ''
  }

  return { 
    allUserInvitations, alertMess,
    fetchAllLeagueInvitations, fetchAllUserInvitations, sendInviteToUser,
    acceptInvitation, deleteInvitation,
    handleLogout
  }
})

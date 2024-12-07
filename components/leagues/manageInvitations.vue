<template>
  <v-dialog :model-value="isShow" max-width="750" @update:model-value="close" >
    <v-card>
      <v-card-title class="align-center justify-center d-flex px-5 py-5">
        {{ $t('user.betLeaguesSites.privateLeaguesInvitations') }}
      </v-card-title>

      <div v-if="leagueInvitations?.length">
        <v-card class="py-1 my-3 mx-3" variant="outlined" color="primary" elevation="10" v-for="invite in leagueInvitations">
        <!-- <div>{{ 'Zaproszenie od: ' + invite.ownerNick }}</div> -->
          <v-row justify="space-around">
            <div class="d-flex justify-center flex-column align-center text-h6 py-2"> 
                {{ invite.name }}
              </div>
            <v-col cols="12" sm="auto" class="d-flex flex-column justify-center align-center" >
              <div class="text-subtitle-2"> 
                {{ invitations?.find((inv: InvitationModel) => inv.leagueCode === invite.leagueCode)?.ownerNick }}
              </div>
            </v-col>
            <v-col cols="12" sm="auto" class="align-center flex-column justify-center d-flex">
              <div class="font-italic">
                {{ setLeaguesData(invite.league) }}
              </div>
            </v-col>
            <div class="my-2">
                <v-btn icon="mdi-bookmark-check" color="primary" variant="plain" @click="acceptInvitation(invite)"></v-btn>
                <v-btn icon="mdi-cancel" color="error" variant="plain" @click="deleteInvitation(invite)"></v-btn>
            </div>
          </v-row>
        </v-card>
      </div>
      <div v-else>
        <v-row justify="center">
          <v-col>
            <div class="justify-center align-center d-flex">
              <v-icon>mdi-email-alert</v-icon>
            </div>
            <v-card-title class="text-center">{{ $t('user.betLeaguesSites.noInvitationsTitle') }}</v-card-title>
            <v-card-text class="text-center">{{ $t('user.betLeaguesSites.noInvitationsText') }}</v-card-text>
          </v-col>
        </v-row>
      </div>

      <v-alert v-if="mess" class="mx-2" closable type="info">{{ $t(`errors.betLeaguesSites.${mess}`) }}</v-alert>

      <v-card-actions>
        <v-btn variant="outlined" color="error" @click="close">{{ $t('user.betLeaguesSites.cancel') }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import type { DocumentReference } from 'firebase/firestore';
import { useInvitationStore } from '~/stores/invitationStore';
import { useAuthStore } from '~/stores/authStore';
import { useBetLeagueStore } from '~/stores/betLeaguesStore';
import type { InvitationModel } from '~/models/invitation';
import type { LeagueModel } from '~/models/betLeague';

const router = useRouter()

const props = defineProps<{
  isShow: boolean
}>()

const { isShow } = toRefs(props)

const emit = defineEmits<{
  (e: 'onClose'): void
}>()

function close() {
  invitationStore.alertMess = ''
  emit('onClose')
}

const invitationStore = useInvitationStore()
const authStore = useAuthStore()
const betLeagueStore = useBetLeagueStore()

const leagueInvitations = ref<LeagueModel[] | null>()
const invitations = computed(() => invitationStore.allUserInvitations)
const mess = computed(() => invitationStore.alertMess)

const userInvitations = computed(() => {
  const invRefs: DocumentReference[] = []
  invitationStore.allUserInvitations?.forEach((inv: any) => {
    invRefs.push(inv.leagueReference)
  })
  return invRefs
})

watch((invitations), async (oldInvs:any, newInvs: any) => {
  leagueInvitations.value = await betLeagueStore.fetchLeaguesByInvitations(userInvitations?.value)
})

async function acceptInvitation(league: LeagueModel) {
  try {
    if (invitations.value != undefined) {
      const invitation = invitations.value.find((invite: InvitationModel) => invite.leagueReference.id === league.reference.id)
      console.log(invitation)

      if (invitation) {
        console.log(league.reference.id + ' ' + invitation.reference.id)
        await invitationStore.acceptInvitation(league, invitation.reference)
        router.push(`/user/${league.reference.id}`)
      }
    }
  }
  catch (e) {
    console.log(e)
  }
}

async function deleteInvitation(league: LeagueModel) {
  try {
    if (invitations.value != undefined) {
      const invitation = invitations.value.find((invite: InvitationModel) => invite.leagueReference.id === league.reference.id)
      if (invitation) {
        await invitationStore.deleteInvitation(invitation.reference)
      }
    }
  } catch (e) {
    console.log(e)
  }
}

onMounted(async () => {
  try {
    leagueInvitations.value = await betLeagueStore.fetchLeaguesByInvitations(userInvitations?.value)
    console.log(leagueInvitations)
  } catch (e) {
    console.log(e)
  }
})

function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp * 1000);

  const day = date.getUTCDate().toString().padStart(2, '0');
  const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
  const year = date.getUTCFullYear();
  const hours = date.getUTCHours().toString().padStart(2, '0');
  const minutes = date.getUTCMinutes().toString().padStart(2, '0');

  return `${day}.${month}.${year}, ${hours}:${minutes}`;
}

function setLeaguesData(league: string) {
  switch (league) {
    case "eng":
      return "Premier League"
    case "pol":
      return "Ekstraklasa"
    case "ucl":
      return "Champions League"
  }
}
</script>

<style>

</style>
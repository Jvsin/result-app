<template>
  <v-dialog :model-value="isShow" max-width="600" @update:model-value="close" >
    <v-card>
      <v-card-title class="align-center justify-center d-flex px-5 py-5">
        Zaproszenia do prywatnych lig
      </v-card-title>

      <v-card class="py-1" v-for="invite in leagueInvitations">
        <!-- <div>{{ 'Zaproszenie od: ' + invite.ownerNick }}</div> -->
        <v-row justify="space-around">
          <v-col cols="auto" class="d-flex justify-center align-center">
            <v-card-text> 
              {{ invite.name }}
            </v-card-text>
          </v-col>
          <v-col cols="auto" class="d-flex justify-center align-center">
            <v-card-subtitle>
              {{ setLeaguesData(invite.league) }}
            </v-card-subtitle>
          </v-col>
          <v-col cols="auto" class="align-end">
            <v-card-actions justify-end>
              <v-btn icon="mdi-bookmark-check" color="primary" variant="plain"></v-btn>
              <v-btn icon="mdi-cancel" color="error" variant="plain"></v-btn>
            </v-card-actions>
          </v-col>
        </v-row>
      </v-card>

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

const props = defineProps<{
  isShow: boolean
}>()

const { isShow } = toRefs(props)

const emit = defineEmits<{
  (e: 'onClose'): void
}>()

function close() {
  emit('onClose')
}

const invitationStore = useInvitationStore()
const authStore = useAuthStore()
const betLeagueStore = useBetLeagueStore()
const { loggedUserData } = storeToRefs(authStore)

const userInvitations = computed(() => {
  // console.log(invitationStore.allUserInvitations)
  const invRefs: DocumentReference[] = []
  invitationStore.allUserInvitations?.forEach((inv: any) => {
    invRefs.push(inv.leagueReference)
  })
  return invRefs
})
const leagueInvitations = ref()

onMounted(async () => {
  try {
    leagueInvitations.value = await betLeagueStore.fetchLeaguesByInvitations(userInvitations?.value)
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
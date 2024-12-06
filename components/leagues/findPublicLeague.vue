<template>
   <v-dialog :model-value="isShow" max-width="600" @update:model-value="close" >
    <v-card>
      <v-card-title class="align-center justify-center d-flex text-wrap text-center px-5 py-5">
        {{ $t('user.betLeaguesSites.findPublicLeague')}}
      </v-card-title>
      <v-card-text>
        <v-row class="py-2 px-2">
          <v-text-field class="align-center justify-center"
            v-model="searchLeagueName"
            :label="$t('user.betLeaguesSites.editDialog.leagueName')"
            required
            :rules="[lengthRule()]"
          ></v-text-field>
          <v-btn color="primary" class="d-flex ml-2 align-center justify-center"
            variant="plain" icon="mdi-text-search" @click="searchLeagueByName"
          ></v-btn>
        </v-row>

        <v-row class="py-2 px-2">
          <v-text-field class="align-center justify-center"
            v-model="leagueCode"
            :label="$t('user.betLeaguesSites.leagueCode')"
            required
            :rules="[codeLengthRule()]"
          ></v-text-field>
          <v-btn color="primary" class="d-flex ml-2 align-center justify-center"
            variant="plain" icon="mdi-text-search" @click="searchLeague"
          ></v-btn>
        </v-row>
        <v-card v-if="foundLeague" class="d-flex flex-column align-center text-center">
          <v-container>
            <v-row justify="center">
              <v-col cols="12">
                <v-card-title>
                  {{ foundLeague.name }}
                </v-card-title>
              </v-col>
              <v-col cols="12">
                <v-card-subtitle>
                  {{ foundLeague.description }}
                </v-card-subtitle>
              </v-col>
              <v-col cols="12">
                <v-card-subtitle>
                  {{ setLeaguesData(foundLeague.league) }}
                </v-card-subtitle>
              </v-col>
              <v-col cols="12">
                <v-card-subtitle>
                  {{ $t('user.betLeaguesSites.players') +  foundLeague.players.length }}
                </v-card-subtitle>
              </v-col>
              <v-col v-if="isPlayerJoined" cols="12">
                <v-alert type="info">
                  {{ $t('errors.betLeaguesSites.alreadyJoinedToLeague') }}
                </v-alert>
              </v-col>
              <v-col cols="12">
                <v-card-actions class="d-flex justify-center">
                  <v-btn v-if="!isPlayerJoined" variant="outlined" color="primary" prepend-icon="mdi-location-enter" @click="joinLeague">
                    {{ $t('user.betLeaguesSites.join') }}</v-btn>
                  <v-btn v-else variant="outlined" color="primary" prepend-icon="mdi-location-enter" @click="routeToLeague">
                    {{ $t('user.betLeaguesSites.showLeague') }}</v-btn>
                  <v-btn variant="outlined" color="error" prepend-icon="mdi-cancel" @click="cancel">{{ $t('user.betLeaguesSites.cancel') }}</v-btn>
                </v-card-actions>
              </v-col>
            </v-row>
          </v-container>
        </v-card>

        <v-card elevation="12" v-if="leaguesByName" v-for="foundLeague in leaguesByName" 
        class="d-flex flex-column align-center text-center my-2">
          <v-container>
            <v-row justify="center">
              <v-col cols="12">
                <v-card-title>
                  {{ foundLeague.name }}
                </v-card-title>
              </v-col>
              <v-col cols="12">
                <v-card-subtitle>
                  {{ foundLeague.description }}
                </v-card-subtitle>
              </v-col>
              <v-col cols="12">
                <v-card-subtitle>
                  {{ setLeaguesData(foundLeague.league) }}
                </v-card-subtitle>
              </v-col>
              <v-col cols="12">
                <v-card-subtitle>
                  {{ $t('user.betLeaguesSites.players') +  foundLeague.players.length }}
                </v-card-subtitle>
              </v-col>
              <v-col v-if="isPlayerJoined" cols="12">
                <v-alert type="info">
                  {{ $t('errors.betLeaguesSites.alreadyJoinedToLeague') }}
                </v-alert>
              </v-col>
              <v-col cols="12">
                <v-card-actions class="d-flex justify-center">
                  <v-btn v-if="!isPlayerJoined" variant="outlined" color="primary" prepend-icon="mdi-location-enter" @click="joinLeague">
                    {{ $t('user.betLeaguesSites.join') }}</v-btn>
                  <v-btn v-else variant="outlined" color="primary" prepend-icon="mdi-location-enter" @click="routeToLeague">
                    {{ $t('user.betLeaguesSites.showLeague') }}</v-btn>
                  <v-btn variant="outlined" color="error" prepend-icon="mdi-cancel" @click="cancel">{{ $t('user.betLeaguesSites.cancel') }}</v-btn>
                </v-card-actions>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
        <v-alert closable elevation="13" v-if="errorMessage.length" type="error">
          {{ $t(`errors.betLeaguesSites.${errorMessage}`) }}</v-alert>
      </v-card-text>
      <v-card-actions>
        <v-btn variant="outlined" color="error" @click="close">{{ $t('user.betLeaguesSites.cancel') }}</v-btn>
      </v-card-actions>
    </v-card>
   </v-dialog>
</template>

<script lang="ts" setup>
import type { LeagueModel } from '~/models/betLeague';
import { useBetLeagueStore } from '~/stores/betLeaguesStore'
import { useAuthStore } from '~/stores/authStore'
import { codeLengthRule, lengthRule } from '~/composables/rules'

const router = useRouter()

const props = defineProps<{
  isShow: boolean
}>()

const { isShow } = toRefs(props)

const betLeagueStore = useBetLeagueStore()
const authStore = useAuthStore()
const { loggedUserData } = storeToRefs(authStore)
const { userBetLeagues, mess } = storeToRefs(betLeagueStore)

const leagueCode = ref('')
const foundLeague = ref<LeagueModel | null>()
const errorMessage = ref('')

watch((mess), async (oldMess: string, newMess: string) => {
  errorMessage.value = mess.value
})

const isPlayerJoined = ref(false)

const emit = defineEmits<{
  (e: 'onClose'): void
}>()

function close() {
  errorMessage.value = ''
  isPlayerJoined.value = false
  foundLeague.value = null
  leaguesByName.value = []
  searchLeagueName.value = ''
  leagueCode.value = ''
  betLeagueStore.mess = ''
  emit('onClose')
}

async function searchLeague() {
  try {
    foundLeague.value = await betLeagueStore.fetchLeagueByCode(leagueCode.value)
    userBetLeagues.value.forEach((league: LeagueModel) => {
      if (league.leagueCode === leagueCode.value) {
        isPlayerJoined.value = true
      }
    })
  } catch (e) {
    console.log(e)
  }
}

const leaguesByName = ref()
const searchLeagueName = ref('')
async function searchLeagueByName() { 
  try {
    leaguesByName.value = await betLeagueStore.fetchLeaguesByName(searchLeagueName.value)
    console.log(leaguesByName)
    userBetLeagues.value.forEach((league: LeagueModel) => {
      leaguesByName.value.forEach((foundLeague: LeagueModel) => {
        if (league.leagueCode === foundLeague.leagueCode) {
          isPlayerJoined.value = true
        }
      })
    })
  } catch (e) {
    console.log(e)
  }
}

function routeToLeague() {
  router.push(`/user/${foundLeague.value?.reference.id}`)
}

async function joinLeague() {
  try {
    if (foundLeague.value != undefined) {
      await betLeagueStore.joinLeague(foundLeague.value)
      console.log("Przchodzę do strony...")
      router.push(`/user/${foundLeague.value.reference.id}`)
    }
  } catch (e) {
    console.log(e)
  }
}

function cancel() {
  searchLeagueName.value = ''
  leagueCode.value = ''
  foundLeague.value = null
  leaguesByName.value = []
  isPlayerJoined.value = false
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
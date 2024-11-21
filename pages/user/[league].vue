<template>
    <v-layout class="rounded rounded-md">
      <v-main class="d-flex align-center justify-center" style="height: 100vh; overflow: hidden;">
        <v-img src="/public/english-league.jpg" cover gradient="to bottom, rgba(0,0,0,.25), rgba(0,0,0,.6)"
          class="text-center w-100 h-100">
          <v-sheet class="d-flex justify-center flex-wrap text-center mx-auto my-10 px-4" elevation="4"
            style="background-color: rgba(0, 0, 0, 0.5); height: 90%; width: 90%" rounded>
            <v-col cols="12">
              <!-- <v-avatar v-if="!loading" color="white" :src="leagueIcon"></v-avatar> -->
              <v-card-text class="text-h3">{{ league?.name }}</v-card-text>
              <v-card-subtitle class="text-h6">{{ leagueName }}</v-card-subtitle>
              <v-card-text class="text-h6">{{ league?.description }}</v-card-text>

              <div v-if="isAuthor" class="py-1">
                <v-btn class="mb-2 mx-2" prepend-icon="mdi-pencil" color="secondary" variant="outlined">Edytuj ligę</v-btn>
                <v-btn class="mb-2 mx-2" prepend-icon="mdi-account-multiple" color="primary" variant="outlined">Gracze</v-btn>
              </div>
              <div v-else>
                <v-btn class="mb-2 mx-2" prepend-icon="mdi-exit-run" color="error" variant="outlined">Opuść ligę</v-btn>
              </div>

              <v-card v-if="!loading" class="justify-center align-center scrollable-container py-2" variant="text">
                <v-card class="ma-5 d-flex justify-center align-center" variant="text">
                  <v-row class="d-flex align-center">
                    <v-col class="d-flex flex-column align-end align-sm-end justify-center" cols="2" md="1">
                      <v-card-subtitle class="text-center">
                        #
                      </v-card-subtitle>
                    </v-col>
                    <v-col cols="1" md="2">

                    </v-col>
                    <v-col class="d-flex flex-column align-start justify-center" cols="5" md="5">
                      <v-card-subtitle class="text-center">
                        {{ $t('user.betLeaguesSites.playerName') }}
                      </v-card-subtitle>
                    </v-col>
                    <v-col class="d-flex flex-column align-center justify-center" cols="2" md="1">
                      <v-card-subtitle class="text-center">
                        {{ $t('user.betLeaguesSites.accuracy') }}
                      </v-card-subtitle>
                    </v-col>
                    <v-col class="d-flex flex-column align-center justify-center" cols="1" md="2">
                      <v-card-subtitle class="text-center">
                        {{ $t('user.betLeaguesSites.points') }}
                      </v-card-subtitle>
                    </v-col>
                  </v-row>
                </v-card>
                <v-card class="ma-5 d-flex justify-center align-center" v-for="(player,index) in playersTable" variant="text">
                  <v-row class="d-flex align-center">
                    <v-col class="d-flex flex-column align-end align-sm-end justify-center" cols="2" md="1">
                      <v-card-title>
                        {{ index + 1 }}
                      </v-card-title>
                    </v-col>
                    <v-col class="d-flex flex-column align-center justify-center" cols="1" md="2">
                      <v-avatar color="primary">{{ player.nick.charAt(0).toUpperCase() }}</v-avatar>
                    </v-col>
                    <v-col class="d-flex flex-column align-center align-sm-start justify-center" cols="5" md="5">
                      <v-card-title>
                        {{ player.nick }}
                      </v-card-title>
                    </v-col>
                    <v-col class="d-flex flex-column align-center justify-center" cols="2" md="1">
                      <v-card-subtitle>
                        {{ player.betAcc + "%" }}
                      </v-card-subtitle>
                    </v-col>
                    <v-col class="d-flex flex-column align-center justify-center" cols="1" md="2">
                      <v-card-title>
                        {{ player.polPoints }}
                      </v-card-title>
                    </v-col>
                  </v-row>
                </v-card>
              </v-card>
              <div v-else>
                <v-alert type="warning">{{ $t('user.betLeaguesSites.loadingAlert') }}</v-alert>
              </div>
              
            </v-col> 
          </v-sheet>
        </v-img>
      </v-main>
    </v-layout>
</template>

<script lang="ts" setup>
import type { LeagueModel } from '~/models/betLeague';
import { useAuthStore } from '~/stores/authStore';
import { useBetLeagueStore } from '~/stores/betLeaguesStore';

definePageMeta({
  middleware: 'auth'
})

const route = useRoute()
const leagueId = ref(route.params.league as string)
console.log(leagueId)

const isAuthor = ref(false)
const authStore = useAuthStore()
const { loggedUserData } = storeToRefs(authStore)

const leagueIcon = ref("")
const leagueName = ref("")
function setLeaguesData(league: string) {
  switch (league) {
    case "eng":
      leagueIcon.value = "/public/england.png"
      return "Premier League"
    case "pol":
      leagueIcon.value = "/public/poland.png"
      return "Ekstraklasa"
    case "ucl":
      leagueIcon.value = "/public/ucl.png"
      return "Champions League"
  }
  return ""
}

const loading = ref(true)

async function setPlayersTable() {
  await betLeagueStore.fetchPlayersData(league.value.players)
  console.log(betLeagueStore.playersTable.value)
  playersTable.value = betLeagueStore.playersTable
  loading.value = false
}

const betLeagueStore = useBetLeagueStore()
const league = ref();
// const img_src = `/public/${league.value.league}-league.jpg`
const playersTable = ref()

onMounted(async () => {
  loading.value = true

  await betLeagueStore.fetchLeagueById(leagueId.value)
  league.value = betLeagueStore.leagueToDisplay
  leagueName.value = setLeaguesData(league.value.league)

  if (loggedUserData.value?.reference?.id === league.value.owner.id) {
    console.log(true)
    isAuthor.value = true
  }
  
  setPlayersTable()
})

</script>

<style>
.scrollable-container {
  max-height: 700px;
  overflow-y: auto;
  overflow-x: hidden;
}
</style>
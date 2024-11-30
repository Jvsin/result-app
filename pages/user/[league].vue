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
              <v-card-subtitle class="text-h6">{{ $t('user.betLeaguesSites.established') + ': ' +
                formatTimestampToDate(league?.created) }}</v-card-subtitle>
              <v-card-text class="text-h6">{{ league?.description }}</v-card-text>

              <div v-if="isAuthor" class="py-1">
                <!-- <v-btn class="mb-2 mx-2" prepend-icon="mdi-pencil" color="secondary" variant="outlined">Edytuj ligę</v-btn> -->
                <v-btn class="mb-2 mx-2" prepend-icon="mdi-table-account" color="secondary" variant="outlined"
                @click="changeLeagueEditFlag">{{ $t('user.betLeaguesSites.manageLeague') }}</v-btn>
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
            <EditLeagueDialog :players="playersTable" :league="league" :is-show="editFlag" @on-close="changeLeagueEditFlag"/>
          </v-sheet>
        </v-img>
      </v-main>
    </v-layout>
</template>

<script lang="ts" setup>
import type { LeagueModel } from '~/models/betLeague';
import { useAuthStore } from '~/stores/authStore';
import { useBetLeagueStore } from '~/stores/betLeaguesStore'
import EditLeagueDialog from '~/components/leagues/editLeagueDialog.vue';

definePageMeta({
  middleware: 'auth'
})

const editFlag = ref(false)
function changeLeagueEditFlag() {
  editFlag.value = !editFlag.value
}

const route = useRoute()
const leagueId = ref(route.params.league as string)
console.log(leagueId)

const isAuthor = ref(false)
const authStore = useAuthStore()
const { loggedUserData } = storeToRefs(authStore)

const leagueName = ref("")
function setLeaguesData(league: string) {
  switch (league) {
    case "eng":
      return "Premier League"
    case "pol":
      return "Ekstraklasa"
    case "ucl":
      return "Champions League"
  }
  return ""
}

const loading = ref(true)

async function setPlayersTable() {
  if (league.value != undefined) {
    await betLeagueStore.fetchPlayersData(league?.value.players)
  }
  console.log(betLeagueStore.playersTable.value)
  playersTable.value = betLeagueStore.playersTable
  loading.value = false
}

const betLeagueStore = useBetLeagueStore()
const league = computed(() => betLeagueStore.leagueToDisplay)
const playersTable = ref()

onMounted(async () => {
  loading.value = true

  await betLeagueStore.fetchLeagueById(leagueId.value)
  console.log(league.value)
  // league.value = betLeagueStore.leagueToDisplay
  if (league.value != undefined) {
    leagueName.value = setLeaguesData(league.value.league)

    if (loggedUserData.value?.reference?.id === league.value.owner.id) {
      isAuthor.value = true
    }
  }
  
  setPlayersTable()
})

function formatTimestampToDate(timestamp: number | undefined): string {
  if (timestamp != undefined) {
    const date = new Date(timestamp * 1000)

    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}.${month}.${year}`;
  }
  else {
    return 'data zalozenia'
  }
}

</script>

<style>
.scrollable-container {
  max-height: 700px;
  overflow-y: auto;
  overflow-x: hidden;
}
</style>
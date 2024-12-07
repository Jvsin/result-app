<template>
    <v-layout class="rounded rounded-md">
      <v-main class="d-flex align-center justify-center" style="height: 100vh; overflow: hidden;">
        <v-img src="/public/eng_background.jpg" cover gradient="to bottom, rgba(0,0,0,.25), rgba(0,0,0,.6)"
          class="text-center w-100 h-100">
          <v-sheet class="d-flex justify-center flex-wrap text-center mx-auto my-10 px-4" elevation="4"
            style="background-color: rgba(0, 0, 0, 0.5); height: 90%; width: 90%" rounded>
            <v-col cols="12">
              <div>
                <v-btn variant="outlined" prepend-icon="mdi-keyboard-backspace" @click="router.push('/user')">
                {{ $t('user.betLeaguesSites.back') }}</v-btn>
              </div>
              <v-container v-if="!loading" class="scrollable-container">
              <v-card v-if="!loading" variant="text">
                <v-row justify="center">
                 <v-col>
                    <v-card-title class="text-h4 text-wrap">{{ league?.name }}</v-card-title>
                    <v-card-text class="text-h6">{{ league?.description }}</v-card-text>
                    <v-card-subtitle class="text-h7">{{ leagueName }}</v-card-subtitle>
                    <v-card-subtitle class="text-h7">{{ $t('user.betLeaguesSites.established') + ': ' +
                        formatTimestampToDate(league?.created)}} </v-card-subtitle>
                    <v-card-subtitle class="text-h7">{{ $t('user.betLeaguesSites.ownerString') + ownerString }}</v-card-subtitle>
                  </v-col>
                </v-row>
                
                  <div v-if="isAuthor" class="py-1">
                    <!-- <v-btn class="mb-2 mx-2" prepend-icon="mdi-pencil" color="secondary" variant="outlined">Edytuj ligę</v-btn> -->
                    <v-btn class="mb-2 mx-2" prepend-icon="mdi-table-account" color="secondary" variant="outlined"
                    @click="changeLeagueEditFlag">{{ $t('user.betLeaguesSites.manageLeague') }}</v-btn>
                  </div>
                
              </v-card>
              
                <v-card class="justify-center align-center py-2" variant="text">
                  <v-card class="d-flex justify-center align-center" variant="text">
                    <v-row class="d-flex align-center" justify="center">
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
                  <v-card class="d-flex justify-center align-center" v-for="(player,index) in playersTable" variant="text">
                    <v-row justify="center">
                      <v-col class="d-flex flex-column align-end align-sm-end justify-center" cols="2" md="1">
                        <v-card-title v-if="player.nick === loggedUserData?.nick" :style="{ fontWeight: 'bold' }">
                          {{ index + 1 }}
                        </v-card-title>
                        <v-card-title v-else>
                          {{ index + 1 }}
                        </v-card-title>
                      </v-col>
                      <v-col class="d-flex flex-column align-center justify-center" cols="1" md="2">
                        <v-avatar color="primary">{{ player.nick.charAt(0).toUpperCase() }}</v-avatar>
                      </v-col>
                      <v-col class="d-flex flex-column align-center align-sm-start justify-center" cols="5" md="5">
                        <v-card-title v-if="player.nick === loggedUserData?.nick" :style="{ fontWeight: 'bold' }">
                          {{ player.nick.toUpperCase() }}
                        </v-card-title>
                        <v-card-title v-else>
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
                          {{ player[leaguePoints] }}
                        </v-card-title>
                      </v-col>
                    </v-row>
                  </v-card>
                  <div v-if="!isAuthor">
                    <v-btn v-if="!leaveFlag" class="mb-2 mx-2" prepend-icon="mdi-exit-run" color="error" variant="outlined" @click="changeLeaveFlag">
                      {{ $t('user.betLeaguesSites.leaveLeague') }}</v-btn>
                    <div v-else>
                      <v-card-title class="text-h7">{{ $t('user.betLeaguesSites.confirmLeaving') }}</v-card-title>
                      <v-btn class="mb-2 mx-2" prepend-icon="mdi-close" color="error" variant="outlined" @click="changeLeaveFlag">
                        {{ $t('user.betLeaguesSites.cancel') }}</v-btn>
                      <v-btn class="mb-2 mx-2" prepend-icon="mdi-exit-run" color="secondary" variant="text" @click="leaveLeague">
                        {{ $t('user.betLeaguesSites.leaveLeague') }}</v-btn>    
                    </div>                 
                  </div>
                </v-card>
              </v-container>
              <div v-else>
                <v-alert class="my-5 px-2" type="warning">{{ $t('user.betLeaguesSites.loadingAlert') }}</v-alert>
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

const router = useRouter()

const editFlag = ref(false)
function changeLeagueEditFlag() {
  editFlag.value = !editFlag.value
}

const leaveFlag = ref(false)
function changeLeaveFlag() {
  leaveFlag.value = !leaveFlag.value
}

async function leaveLeague() {
  try {
    if (league.value) {
      console.log(league.value.reference)
      await betLeagueStore.leaveLeague(league.value.reference)
      //dodać snackbar z opuszczeniem ligi
      router.push('/user/')
    }
  }
  catch (e) {
    console.log(e)
  }
}

const route = useRoute()
const leagueId = ref(route.params.league as string)
console.log(leagueId)
const setIcon = ref('')

function iconSetFunction(league: string) {
  switch (league) {
    case "pol":
      return "/public/ekstraklasa.png"
    case "eng":
      return "/public/pl.png"
    case "ucl":
      return "/public/ucl.png"
  }
  return ''
}

const isAuthor = ref(false)
const ownerString = ref('')
const authStore = useAuthStore()
const { loggedUserData } = storeToRefs(authStore)

const leagueName = ref("")
const leaguePoints = ref('')
function setLeaguesData(league: string) {
  switch (league) {
    case "eng":
      leaguePoints.value = 'engPoints'
      return "Premier League"
    case "pol":
      leaguePoints.value = 'polPoints'
      return "Ekstraklasa"
    case "ucl":
      leaguePoints.value = 'uclPoints'
      return "Champions League"
  }
  return ""
}

const loading = ref(true)

async function setPlayersTable() {
  if (league.value != undefined) {
    await betLeagueStore.fetchPlayersData(league?.value.players, league.value?.league)
  }
  console.log(betLeagueStore.playersTable)
  playersTable.value = betLeagueStore.playersTable
  ownerString.value = playersTable.value.find((player: any) => player.playerRef.id === league.value?.owner.id).nick

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
    setIcon.value = iconSetFunction(league.value.league)
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
  max-height: 80vh;
  overflow-y: auto;
}
</style>
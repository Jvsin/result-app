<template>
  <v-layout class="rounded rounded-md">
    <v-main class="d-flex align-center justify-center" style="height: 100vh; overflow: hidden;">
      <v-img src="/public/english-league.jpg" cover gradient="to bottom, rgba(0,0,0,.25), rgba(0,0,0,.6)"
        class="text-center w-100 h-100">

        <v-sheet class="d-flex justify-center flex-wrap text-center mx-auto my-10" elevation="4"
          style="background-color: rgba(0, 0, 0, 0.5); height: 90%; width: 90%;" rounded>
          
          <v-row>
            <v-col cols="12">
              <div class="my-2">
                <v-btn variant="outlined" prepend-icon="mdi-keyboard-backspace" @click="router.push('/user')">
                {{ $t('user.betLeaguesSites.back') }}</v-btn>
              </div>
              <v-card-title class="my-2">
                <v-avatar color="white" image="/public/england.png"></v-avatar>
                Premier League 
              </v-card-title>
              <v-tabs v-model="tab" color="primary" class="px-5" grow>
                <v-tab :key="0" value="0">{{ $t('user.betSites.yourPoints') }}</v-tab>
                <v-tab :key="1" value="1">{{ $t('user.betSites.bet') }}</v-tab>
                <v-tab :key="2" value="2">{{ $t('user.betSites.yourBets') }}</v-tab>
              </v-tabs>
              <v-tabs-window v-model="tab">
                <v-tabs-window-item :value="0">
                <v-container v-if="pastUserBetsData?.length" class="scrollable-container" style="background-color: rgba(0, 0, 0, 0); width: 100%;">
                  <datePicker v-if="!dateToShow" @onSave="handleDateSave"></datePicker>
                  <div class="my-2" v-else>
                    <v-btn prepend-icon="mdi-close-box" variant="outlined" color="error" @click="dateToShow = null">
                      {{ formatButtonDate(dateToShow) }}</v-btn>
                  </div>

                  
                    <v-card  :color="setColor(game.id, game.status)" 
                    variant="text" elevation="16" v-for="(game, index) in pastUserBetsData"
                      :key="index" class="my-5 px-0">
                      <v-row>
                        <v-col class="justify-center">
                          <v-card-subtitle>{{ game.id }}</v-card-subtitle>
                          <v-card-subtitle class="text-center">{{ $t('leaguesPage.resultsView.matchDay').toUpperCase()
                            + ' ' + setMatchWeek(game.round) + ' | ' +
                            formatTimestamp(game.timestamp) }}</v-card-subtitle>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="7">
                          <v-row justify="space-around" no-gutters>
                            <v-col cols="3" class="d-flex justify-end align-center">
                              <v-img max-height="50" :src="game.homeLogo" aspect-ratio="1/1"></v-img>
                            </v-col>
                            <v-col cols="1" class="d-none d-sm-flex justify-center align-center">
                              <v-card-title>{{ makeShortName(game.homeName) }}</v-card-title>
                            </v-col>
                            <v-col cols="4" class="d-flex flex-column justify-center align-center">
                              <div v-if="game.status =='NS'" no-wrap class="text-center text-h4"> - 
                              </div>
                              <div v-else no-wrap class="text-center text-h4">{{ game.goalsHome + '-' + game.goalsAway }}
                              </div>
                            </v-col>
                            <v-col cols="1" class="d-none d-sm-flex justify-center align-center">
                              <v-card-title>{{ makeShortName(game.awayName) }}</v-card-title>
                            </v-col>
                            <v-col cols="3" class="d-flex justify-start align-center">
                              <v-img max-height="50" :src="game.awayLogo" aspect-ratio="1/1"></v-img>
                            </v-col>
                          </v-row>
                        </v-col>
                        <v-col cols="5" class="d-flex align-center">
                          <v-row justify="center">
                            <v-col cols="6" class="d-flex flex-column justify-center align-center">
                              <div>
                                <v-card-subtitle>
                                  {{ $t('user.yourBet') + ":"}}
                                </v-card-subtitle>
                                <div no-wrap class="text-center text-h4">
                                  {{ (pastUserBets.find((bet: BetModel) => bet.matchID === game.id)) ? 
                                    pastUserBets.find((bet: BetModel) => bet.matchID === game.id)?.home + '-'
                                    + pastUserBets.find((bet: BetModel) => bet.matchID === game.id)?.away
                                    : '-' }}
                                </div>
                            </div>
                            </v-col>
                            <v-col cols="6" class="d-flex flex-column justify-center align-center">
                              <v-card-subtitle>
                                {{ $t('user.points') + ":" }}
                              </v-card-subtitle>
                              <div v-if="game.status =='FT'" class="text-h4">
                                {{ (pastUserBets.find((bet: BetModel) => bet.matchID === game.id)) ? 
                                  pastUserBets.find((bet: BetModel) => bet.matchID === game.id)?.points : '-' }}
                              </div>
                              <div v-else class="text-h4">
                                ?
                              </div>
                            </v-col>
                          </v-row>
                        </v-col>
                      </v-row>
                      <v-progress-linear v-if="game.status !== 'FT'" color="red" height="5"
                        :model-value="game.timeElapsed /90 * 100" striped></v-progress-linear>
                    </v-card>
                  </v-container>
                  <div v-else class="py-5">
                      <v-card-title class="text-center">{{ $t('user.betSites.noPointsTitle') }}</v-card-title>
                      <v-card-text class="text-center">{{ $t('user.betSites.noPointsInfo') }}</v-card-text>
                    </div>
                </v-tabs-window-item>
                
                <v-tabs-window-item :value="1">
                  <v-container v-if="!loading" class="scrollable-container" style="background-color: rgba(0, 0, 0, 0);">
                    <v-row justify="center">
                      <v-col cols="auto">
                        <v-card-text>{{ $t('user.betSites.showMatchesCounter') }}</v-card-text>
                        <v-select
                          :label="$t('user.show')"
                          :items="[10, 15, 20]"
                          v-model="matchesNumber"
                        ></v-select>
                      </v-col>
                    </v-row>
                    <v-card variant="text" elevation="16" v-for="(game, index) in nextGames" :key="index"
                      class="mb-5 py-2">
                      <!-- <div v-if="game.fixture.status.short == 'NS'"> -->
                        <v-row>
                        <v-col class="justify-center">
                          <v-card-subtitle>{{ game.id }}</v-card-subtitle>
                          <v-card-subtitle class="text-center ">{{ $t('leaguesPage.resultsView.matchDay').toUpperCase()
                            + ' ' + setMatchWeek(game.round) + ' | ' +
                            formatTimestamp(game.timestamp) }}</v-card-subtitle>
                        </v-col>
                      </v-row>
                      <v-row class="d-flex align-center" justify="center">
                        <v-col cols="2" md="1" class="d-flex justify-center align-center">
                          <v-img max-height="70" :src="game.homeLogo" aspect-ratio="1/1"></v-img>
                        </v-col>
                        <v-col cols="2" class="d-none d-md-flex justify-center align-center">
                          <v-card-title>{{ game.homeName }}</v-card-title>
                        </v-col>

                        <v-col cols="auto" class="d-flex justify-center align-center mt-3">
                          <v-number-input v-model="betsToSave[game.id].home" :min="0" reverse controlVariant="stacked" label="" :hideInput="false"
                            :inset="false" variant="outlined"></v-number-input>
                          <v-number-input v-model="betsToSave[game.id].away" :min="0" controlVariant="stacked" label="" :hideInput="false" :inset="false"
                            variant="outlined"></v-number-input>
                        </v-col>

                        <v-col cols="2" class="d-none d-md-flex justify-center align-center">
                          <v-card-title>{{ game.awayName }}</v-card-title>
                        </v-col>
                        <v-col cols="2" md="1" class="d-flex justify-center align-center">
                          <v-img max-height="70" :src="game.awayLogo" aspect-ratio="1/1"></v-img>
                        </v-col>
                      </v-row>
                      <div class="py-2">
                        <v-btn color="primary" variant="tonal" size="small" @click="saveBet(game.id)">
                        {{ $t('user.save') }}<v-icon>mdi-check</v-icon></v-btn>
                      </div>
                      <!-- </div> -->
                    </v-card>
                  </v-container>
                  <v-alert v-else type="warning">{{ $t('snackbars.loading') + '...'}}</v-alert>
                </v-tabs-window-item>

                <v-tabs-window-item :value="2">
                    <v-container class="scrollable-container" v-if="futureUserBetsData?.length" style="background-color: rgba(0, 0, 0, 0);">
                      <v-card :color="setBetColor(game.status, game.id)" variant="text" elevation="16" v-for="(game, index) in futureUserBetsData" :key="index"
                        class="mb-5 px-4 py-2">
                        <v-row>
                          <v-col class="justify-center">
                            <v-card-subtitle>{{ game.id }}</v-card-subtitle>
                            <v-card-subtitle class="text-center ">{{ $t('leaguesPage.resultsView.matchDay').toUpperCase()
                              + ' ' + setMatchWeek(game.round) + ' | ' +
                              formatTimestamp(game.timestamp) }}</v-card-subtitle>
                          </v-col>
                        </v-row>
                        <v-row class="d-flex align-center" justify="center">
                          <v-col cols="2" md="1" class="d-flex justify-center align-center">
                            <v-img max-height="70" :src="game.homeLogo" aspect-ratio="1/1"></v-img>
                          </v-col>
                          <v-col cols="3" class="d-flex justify-center align-center">
                            <v-card-title class="d-none d-sm-flex">{{ game.homeName }}</v-card-title>
                            <v-card-title class="d-flex d-sm-none">{{ makeShortName(game.homeName) }}</v-card-title>
                          </v-col>

                          <v-col cols="2" class="d-flex justify-center align-center">
                            <div no-wrap class="text-center text-h4">
                              <v-card-subtitle>
                                  {{ $t('user.yourBet') + ":"}}
                                </v-card-subtitle>
                              {{ futureUserBets[game.id]?.home + '-'
                            + futureUserBets[game.id]?.away }}
                              <div v-if="game.status != 'NS'" class="text-center text-h4">
                                <v-card-subtitle>
                                  {{'(' + game.goalsHome + '-'
                                + game.goalsAway + ')'}}
                                </v-card-subtitle>
                              </div>
                            </div>

                            <!-- <v-number-input v-model="lastUserBets[game.fixture.id].home" :min="0" reverse controlVariant="stacked" label="" :hideInput="false"
                              :inset="false" variant="outlined"></v-number-input>
                            <v-number-input v-model="lastUserBets[game.fixture.id].away" :min="0" controlVariant="stacked" label="" :hideInput="false" :inset="false"
                              variant="outlined"></v-number-input> -->
                          </v-col>

                          <v-col cols="3" class="d-flex justify-center align-center">
                            <v-card-title class="d-none d-sm-flex">{{ game.awayName }}</v-card-title>
                            <v-card-title class="d-flex d-sm-none">{{ makeShortName(game.awayName) }}</v-card-title>
                          </v-col>
                          <v-col cols="2" md="1" class="d-flex justify-center align-center">
                            <v-img max-height="70" :src="game.awayLogo" aspect-ratio="1/1"></v-img>
                          </v-col>
                        </v-row>
                        <v-progress-linear v-if="game.status !== 'NS'" color="cyan" height="5" class="my-2"
                          :model-value="game.timeElapsed /90 * 100" striped></v-progress-linear>
                      </v-card>
                    </v-container>
                    <v-container class="py-5 align-stretch" v-else>
                      <v-card-title class="text-center">{{ $t('user.betSites.noBetsTitle') }}</v-card-title>
                      <v-card-text class="text-center">{{ $t('user.betSites.noPointsInfo') }}</v-card-text>
                    </v-container>
                  
                    <!-- <v-alert v-else type="warning">{{ $t('snackbars.loading') + '...'}}</v-alert> -->
                  
                </v-tabs-window-item>
              </v-tabs-window>
            </v-col>
          </v-row>
        </v-sheet>
      </v-img>
    </v-main>
  </v-layout>
</template>

<script lang="ts" setup>
import { useDisplay } from 'vuetify'
import type { BetModel, IBet } from '~/models/bet';
import { useBetStore } from '~/stores/betStore';
import { useAuthStore } from '~/stores/authStore';
import type { IMatch } from '~/models/match';
import datePicker from '~/components/user/datePicker.vue';
import type { Timestamp } from 'firebase/firestore';

definePageMeta({
  middleware: 'auth'
})

const tab = ref(0)
const { mobile } = useDisplay()
const router = useRouter()

const betStore = useBetStore()
const authStore = useAuthStore()
const nextGames = computed(() => {
  return betStore.nextGames.filter((game: IMatch) => game.league === "eng")
})
const user = computed(() => authStore.loggedUserData)

const dateToShow = ref()
function handleDateSave(date: Number) {
  dateToShow.value = date
}

const pastUserBets = computed(() => {
  if (!dateToShow.value) return betStore.pastUserBets.filter((bet: IBet) => bet.league === "eng")

  const startTimestamp = dateToShow.value;
  const endTimestamp = startTimestamp + 86400

  console.log(startTimestamp + ' ' + endTimestamp)

  return betStore.pastUserBets.filter((bet: IBet) => {
    return (
      bet.league === "eng" &&
      bet.matchDate >= startTimestamp &&
      bet.matchDate < endTimestamp
    );
  });
});

const pastUserBetsData = computed(() => {
  if (betStore.pastBetsData) {
    if (!dateToShow.value) return betStore.pastBetsData.filter((bet: IMatch) => bet.league === "eng")

    const startTimestamp = dateToShow.value;
    const endTimestamp = startTimestamp + 86400

    console.log(startTimestamp + ' ' + endTimestamp)

    return betStore.pastBetsData.filter((bet: IMatch) => {
      return (
        bet.league === "eng" &&
        bet.timestamp >= startTimestamp &&
        bet.timestamp < endTimestamp
      );
    });
  }
})


const futureUserBets = computed(() => {
  const bets = ref<{ [key: number]: IBet }>({})
  betStore.futureUserBets.forEach((game : any) => {
    if (game.league == 'eng') {
      const bet: IBet = {
      matchID: game.matchID,
      matchDate: game.matchDate,
      home: game.home,
      away: game.away,
      points: game.points,
      counted: game.counted,
      league: "eng"
      };
      // console.log(bet);
      bets.value[game.matchID] = bet
    }
  })
  console.log(bets)
  return bets.value
})
const futureUserBetsData = computed(() => {
  return betStore.futureBetsData?.filter((bet: IMatch) => bet.league === "eng")
})

const loading = ref<Boolean>(false)
const matchesNumber = ref<number>(10)
watch(matchesNumber, async (oldNum:any, newNum:any) => {
  loading.value = true
  await betStore.fetchNextFixturesData(39, matchesNumber.value)
  setBetsToSave()
}, { immediate: true });

const betsToSave = ref<{ [key: number]: IBet }>({})
function setBetsToSave() {
  console.log(nextGames.value)
  if (nextGames.value != undefined) {
    nextGames.value.forEach((game : IMatch) => {
      if(game.league === "eng"){
        const bet: IBet = {
          matchID: game.id,
          matchDate: game.timestamp,
          home: 0,
          away: 0,
          points: 0,
          counted: false,
          league: "eng"
        };
        // console.log(bet);
        betsToSave.value[game.id] = bet
      }
    });
  }
  console.log(betsToSave.value)
  loading.value = false
}

async function saveBet(matchID: number) {
  const bet = betsToSave.value[matchID]
  console.log(bet)

  if (user.value?.reference) {
    await betStore.saveUserBet(user.value.reference, bet)
  }
}

async function fetchFutureUserBets() {
  if (user.value?.reference) {
    loading.value = true
    await betStore.fetchFutureUserBets(user.value.reference, "eng")
  }
  loading.value = false
  console.log(futureUserBets.value)
}


function setMatchWeek(input: String): string {
  if (input.length === 0) {
    return '';
  }
  return input.charAt(input.length - 2) + input.charAt(input.length - 1);
}

function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp * 1000);

  const day = date.getUTCDate().toString().padStart(2, '0');
  const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
  const year = date.getUTCFullYear();
  const hours = date.getUTCHours().toString().padStart(2, '0');
  const minutes = date.getUTCMinutes().toString().padStart(2, '0');

  return `${day}.${month}.${year}, ${hours}:${minutes}`;
}

function formatButtonDate(timestamp: number): string {
  const date = new Date(timestamp * 1000);

  const day = (date.getUTCDate()+1).toString().padStart(2, '0');
  const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
  const year = date.getUTCFullYear();

  return `${day}.${month}.${year}`
}

function setColor(matchID: Number, status: String) {
  const userBet = pastUserBets.value.find((bet: BetModel) => bet.matchID === matchID);
  if (status == 'FT') {
    if (userBet != undefined) {
      switch (userBet.points) {
        case 3:
          return 'green'
        case 1:
          return "orange";
        case 0:
          return "red";
        default:
          return "red";
      }
    }
  } else if(status == 'NS') {
    return 'cyan'
  } else {
    'white'
  }
}

function setBetColor(status: String, matchID: number) {
  const userBet = futureUserBets.value[matchID]
  switch (status) {
    case "NS":
      return 'white'
    default:
      return 'cyan'
  }
}

function makeShortName(name: String) {
  const space = name.indexOf(' ')
  if (space !== -1) {
    return (name.substring(0,1) + name.substring(space + 1, space + 3)).toUpperCase()
  }
  else {
    return name.substring(0,3).toUpperCase()
  }
}

onMounted(async () => {
  await betStore.fetchNextFixturesData(39, 10)
  // await betStore.fetchLastFixturesData(39, 2024)

  if (user.value?.reference) {
    await betStore.fetchPastUserBets(user.value?.reference, 'eng')
    await betStore.fetchFutureUserBets(user.value?.reference, 'eng')
    // betStore.fetchUserBets(user.value.reference)
    // console.log(userBets.value)
  }
  setBetsToSave()
})
</script>

<style scoped>
.scrollable-container {
  max-height: 70vh;
  overflow-y: auto;
}
</style>
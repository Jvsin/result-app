<template>
  <v-layout class="rounded rounded-md">
    <v-main class="d-flex align-center justify-center" style="height: 100vh; overflow: hidden;">
      <v-img src="/public/english-league.jpg" cover gradient="to bottom, rgba(0,0,0,.25), rgba(0,0,0,.6)"
        class="text-center w-100 h-100">

        <v-sheet class="d-flex justify-center flex-wrap text-center mx-auto my-10" elevation="4"
          style="background-color: rgba(0, 0, 0, 0.5); height: 90%; width: 90%;" rounded>
          <v-row>
            <v-col cols="12">
              <v-card-title class="my-2">
                <v-avatar image="/public/england.png"></v-avatar>
                Premier League
              </v-card-title>
              <v-tabs v-model="tab" color="primary" class="px-5" grow>
                <v-tab :key="0" value="0">{{ $t('user.yourBets') }}</v-tab>
                <v-tab :key="1" value="1">{{ $t('user.bet') }}</v-tab>
              </v-tabs>
              <v-tabs-window v-model="tab">
                <v-tabs-window-item :value="0">
                  <v-container class="scrollable-container" style="background-color: rgba(0, 0, 0, 0);">
                    <v-card :color="setColor(0)" variant="text" elevation="16" v-for="(game, index) in lastGames"
                      :key="index" class="my-5 px-4">
                      <v-row>
                        <v-col class="justify-center">
                          <v-card-subtitle>{{ game.fixture.id }}</v-card-subtitle>
                          <v-card-subtitle class="text-center">{{ $t('leaguesPage.resultsView.matchDay').toUpperCase()
                            + ' ' + setMatchWeek(game.league.round) + ' | ' +
                            formatTimestamp(game.fixture.timestamp) }}</v-card-subtitle>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="7">
                          <v-row justify="space-around" no-gutters>
                            <v-col cols="3" class="d-flex justify-end align-center">
                              <v-img max-height="50" :src="game.teams.home.logo" aspect-ratio="1/1"></v-img>
                            </v-col>
                            <v-col cols="1" class="d-none d-sm-flex justify-center align-center">
                              <v-card-title>{{ makeShortName(game.teams.home.name) }}</v-card-title>
                            </v-col>
                            <v-col cols="4" class="d-flex flex-column justify-center align-center">
                              <div no-wrap class="text-center text-h4">{{ game.goals.home + '-' + game.goals.away }}
                              </div>
                            </v-col>
                            <v-col cols="1" class="d-none d-sm-flex justify-center align-center">
                              <v-card-title>{{ makeShortName(game.teams.away.name) }}</v-card-title>
                            </v-col>
                            <v-col cols="3" class="d-flex justify-start align-center">
                              <v-img max-height="50" :src="game.teams.away.logo" aspect-ratio="1/1"></v-img>
                            </v-col>
                          </v-row>
                        </v-col>
                        <v-col cols="5" class="d-flex align-center">
                          <v-row justify="center">
                            <v-col cols="6" class="d-flex flex-column justify-center align-center">
                              <div>
                                <v-card-subtitle>
                                  Twój typ:
                                </v-card-subtitle>
                                <div class="text-h4">0-0</div>
                              </div>
                            </v-col>
                            <v-col cols="6" class="d-flex flex-column justify-center align-center">
                              <v-card-subtitle>
                                Punkty:
                              </v-card-subtitle>
                              <div class="text-h4">+3</div>
                            </v-col>
                          </v-row>

                        </v-col>
                      </v-row>
                    </v-card>
                  </v-container>

                </v-tabs-window-item>

                <v-tabs-window-item :value="1">
                  <v-container class="scrollable-container" style="background-color: rgba(0, 0, 0, 0);">
                    <v-card-actions class="justify-center">
                      <v-btn color="primary" variant="tonal" size="large">{{ $t('user.saveBets') }}</v-btn>
                    </v-card-actions>
                    <v-card variant="text" elevation="16" v-for="(game, index) in nextGames" :key="index"
                      class="my-10 px-4">
                      <v-row>
                        <v-col class="justify-center">
                          <v-card-subtitle>{{ game.fixture.id }}</v-card-subtitle>
                          <v-card-subtitle class="text-center ">{{ $t('leaguesPage.resultsView.matchDay').toUpperCase()
                            + ' ' + setMatchWeek(game.league.round) + ' | ' +
                            formatTimestamp(game.fixture.timestamp) }}</v-card-subtitle>
                        </v-col>
                      </v-row>
                      <v-row class="d-flex align-center" justify="center">
                        <v-col cols="2" md="1" class="d-flex justify-center align-center">
                          <v-img max-height="50" :src="game.teams.home.logo" aspect-ratio="1/1"></v-img>
                        </v-col>
                        <v-col cols="2" class="d-none d-md-flex justify-center align-center">
                          <v-card-title>{{ game.teams.home.name }}</v-card-title>
                        </v-col>

                        <v-col cols="auto" class="d-flex justify-center align-center mt-3">
                          <v-number-input v-model="betsToSave[game.fixture.id].home" :min="0" reverse controlVariant="stacked" label="" :hideInput="false"
                            :inset="false" variant="outlined"></v-number-input>
                          <v-number-input v-model="betsToSave[game.fixture.id].away" :min="0" controlVariant="stacked" label="" :hideInput="false" :inset="false"
                            variant="outlined"></v-number-input>
                        </v-col>

                        <v-col cols="2" class="d-none d-md-flex justify-center align-center">
                          <v-card-title>{{ game.teams.away.name }}</v-card-title>
                        </v-col>
                        <v-col cols="2" md="1" class="d-flex justify-center align-center">
                          <v-img :max-height="50" :src="game.teams.away.logo" aspect-ratio="1/1"></v-img>
                        </v-col>
                      </v-row>
                      <v-btn color="primary" variant="tonal" size="small" @click="saveBet(game.fixture.id)">
                        {{ $t('user.save') }}<v-icon>mdi-check</v-icon></v-btn>
                    </v-card>
                  </v-container>
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

definePageMeta({
  middleware: 'auth'
})

const tab = ref(0)
const { mobile } = useDisplay()

const betStore = useBetStore()
const authStore = useAuthStore()
const nextGames = computed(() => betStore.nextGames);
const lastGames = computed(() => betStore.pastGames)
const user = computed(() => authStore.loggedUserData)
const userBets = computed(() => betStore.userBets)

const betsToSave = ref<{ [key: number]: IBet }>({});

function setBetsToSave() {
  console.log(nextGames.value)
  nextGames.value.forEach((game : any) => {
  console.log(game);
  const bet: IBet = {
    matchID: game.fixture.id,
    matchDate: game.fixture.date,
    home: 0,
    away: 0,
    points: 0,
    counted: false,
    league: "eng"
  };
  console.log(bet);
  betsToSave.value[game.fixture.id] = bet
});
}

async function saveBet(matchID: number) {
  const bet = betsToSave.value[matchID]
  console.log(bet)

  if (user.value?.reference) {
    await betStore.saveUserBet(user.value.reference, bet)
  }
}

function setMatchWeek(input: string): string {
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

function setColor(bet: any) {
  switch (bet) {
    case 3:
      return 'green'
    case 1:
      return "orange";
    case 0:
      return "red";
  }
}

function makeShortName(name: string) {
  const space = name.indexOf(' ')
  if (space !== -1) {
    return (name.substring(0,1) + name.substring(space + 1, space + 3)).toUpperCase()
  }
  else {
    return name.substring(0,3).toUpperCase()
  }
}

onMounted(() => {
  console.log("liverpool".indexOf(' '))
  betStore.fetchNextFixturesData(39, 2024)
  betStore.fetchLastFixturesData(39, 2024)
  if (user.value?.reference) {
    betStore.fetchUserBets(user.value.reference)
    console.log()
  }
  setBetsToSave()
})
</script>

<style scoped>
.scrollable-container {
  max-height: 75vh;
  overflow-y: auto;
}
</style>
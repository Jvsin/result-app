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
                  <div class="scrollable-container" style="background-color: rgba(0, 0, 0, 0);">
                    <v-card :color="setColor(0)" variant="text" elevation="16" v-for="(game, index) in lastGames" :key="index">
                      <v-row>
                        <v-col class="justify-center">
                          <v-card-subtitle class="text-center">{{ $t('leaguesPage.resultsView.matchDay').toUpperCase()
                            + ' ' + setMatchWeek(game.league.round) + ' | ' +
                            formatTimestamp(game.fixture.timestamp) }}</v-card-subtitle>      
                        </v-col>
                      </v-row>
                      <v-row>
                          <v-col cols="8">
                            
                            <v-row justify="center">
                              <v-col cols="4" class="d-flex justify-end align-center">
                                <v-img max-height="50" :src="game.teams.home.logo" aspect-ratio="1/1"></v-img>
                              </v-col>
                              <v-col cols="4" class="d-flex flex-column justify-center align-center">
                                <div no-wrap class="text-center text-h4">{{ game.goals.home + '-' + game.goals.away }}</div>
                                <v-card-subtitle v-if="game.fixture.status.short !== 'FT'" no-wrap class="text-center">{{ game.fixture.status.elapsed }}
                              </v-card-subtitle>
                              </v-col>
                              <v-col cols="4" class="d-flex justify-start align-center">
                                <v-img max-height="50" :src="game.teams.away.logo" aspect-ratio="1/1"></v-img>
                              </v-col>
                            </v-row>
                          </v-col>
                          <v-col cols="4" class="d-flex align-center justify-center">
                            <v-row justify="space-around">
                              <v-col cols="6" class="d-flex flex-column justify-center align-center">
                                <v-card-subtitle>
                                  Twój typ:
                                </v-card-subtitle>
                                <div class="text-h4">0-0</div>
                              </v-col>
                              <v-col cols="6" class="d-flex flex-column justify-center align-center">
                                <v-card-subtitle>
                                  Punkty:
                                </v-card-subtitle>
                                <div >3 pkt</div>
                              </v-col> 
                            </v-row>  
                          </v-col>
                      </v-row>
                    </v-card>
                  </div>

                </v-tabs-window-item>

                <v-tabs-window-item :value="1">
                  <div class="scrollable-container" style="background-color: rgba(0, 0, 0, 0);">
                    <v-card-actions class="justify-center">
                      <v-btn color="primary" variant="tonal" size="large">{{ $t('user.saveBets') }}</v-btn>
                    </v-card-actions>
                    <v-card variant="text" elevation="16" v-for="(game, index) in nextGames" :key="index">
                      <v-row>
                        <v-col class="justify-center">
                          <v-card-subtitle class="text-center ">{{ $t('leaguesPage.resultsView.matchDay').toUpperCase()
                            + ' ' + setMatchWeek(game.league.round) + ' | ' +
                            formatTimestamp(game.fixture.timestamp) }}</v-card-subtitle>
                        </v-col>
                      </v-row>
                      <v-row></v-row>
                      <v-row class="d-flex align-center" justify="center">
                        <v-col cols="2" md="1" class="d-flex justify-center align-center">
                          <v-img max-height="50" :src="game.teams.home.logo" aspect-ratio="1/1"></v-img>
                        </v-col>
                        <v-col cols="2" class="d-none d-md-flex justify-center align-center">
                          <v-card-title>{{ game.teams.home.name }}</v-card-title>
                        </v-col>

                        <v-col cols="auto">
                          <v-number-input :min="0" reverse controlVariant="stacked" label="" :hideInput="false"
                            :inset="false" variant="outlined"></v-number-input>
                        </v-col>
                        <v-col cols="auto">
                          <v-number-input :min="0" controlVariant="stacked" label="" :hideInput="false" :inset="false"
                            variant="outlined"></v-number-input>
                        </v-col>

                        <v-col cols="2" class="d-none d-md-flex justify-center align-center">
                          <v-card-title>{{ game.teams.away.name }}</v-card-title>
                        </v-col>
                        <v-col cols="2" md="1" class="d-flex justify-center align-center">
                          <v-img :max-height="50" :src="game.teams.away.logo" aspect-ratio="1/1"></v-img>
                        </v-col>
                      </v-row>
                    </v-card>
                  </div>
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

const tab = ref(0)
const { mobile } = useDisplay()

const betStore = useBetStore()
const nextGames = computed(() => betStore.nextGames);
const lastGames = computed(() => betStore.pastGames)

function setMatchWeek(input: string): string {
  if (input.length === 0) {
    return '';
  }
  return input.charAt(input.length - 2) + input.charAt(input.length - 1);
}

function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp * 1000);

  const day = date.getUTCDate().toString().padStart(2, '0');
  const month = (date.getUTCMonth() + 1).toString().padStart(2, '0'); // Miesiące są 0-indeksowane
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

onMounted(() => {
  betStore.fetchNextGames(39, 2024)
  betStore.fetchLastFixturesData(39,2024)
})
</script>

<style>
.scrollable-container {
  max-height: 75vh;
  overflow-y: auto;
}
</style>
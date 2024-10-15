<template>
  <v-container v-if="leagueData">
    <v-tabs v-model="tab" align-tabs="start" color="primary" grow>
      <v-tab :key="0" value="0">{{ $t("leaguesPage.table") }}</v-tab>
      <v-tab :key="1" value="1">{{ $t("leaguesPage.results") }}</v-tab>
      <v-tab :key="2" value="2">{{ $t("leaguesPage.fixtures") }}</v-tab>
    </v-tabs>

    <v-tabs-window v-model="tab">
      <v-tabs-window-item :value="1">
        <v-card>
          <template v-slot:title>
            <v-row cols="12" align="center">
              <v-col cols="2" class="d-flex justify-center">
                <v-img :src="leagueData.logo" aspect-ratio="1/1" alt="League Logo" max-height="60"></v-img>
              </v-col>
              <v-col cols="10" class="d-flex">
                <v-card flat>
                  <v-card-title class="text-h3 text-center">
                    {{ leagueData.name }}
                  </v-card-title>
                </v-card>
              </v-col>
            </v-row>
            <v-col class="d-flex">
              <v-card flat>
                <v-card-subtitle class="text-sm-left">
                  <div>{{ $t('leaguesPage.tableView.season') + ': ' + countSeason(leagueStands?.standings.season) }}</div>
                  <div>{{ $t('leaguesPage.tableView.lastActualization') +': ' + countDate() }}</div>
                </v-card-subtitle>
              </v-card>
            </v-col>
          </template>

          <v-divider :thickness="4" class="border-opacity-75 mx-5 py-1" color="primary"></v-divider>

          <v-card>
            <v-row class="d-flex align-center">
              <v-col cols="1" class="d-flex justify-center align-center">
                <p class=" ml-2 font-weight-thin">#</p>
              </v-col>

              <v-col cols="1" class="justify-center align-center">
              </v-col>

              <v-col cols="6" class="d-flex align-center">
                <p class="font-italic ">{{ $t('leaguesPage.tableView.teamName') }}</p>
              </v-col>

              <v-col cols="1" class="d-flex justify-center align-center">
                <p class="font-italic">M</p>
              </v-col>

              <v-col cols="1" class="d-flex justify-center align-center">
                <p class="font-italic">GD</p>
              </v-col>

              <v-col cols="1" class="d-flex justify-center align-center">
                <p class="mr-1 font-italic">P</p>
              </v-col>
              <v-divider :thickness="1" class="border-opacity-25" color="white"></v-divider>
            </v-row>
          </v-card>
          <v-card elevation="16" class="py-1" v-for="(standing, index) in leagueStands?.standings.standings[0]"
            :key="index">
            <v-row class="d-flex align-center">
              <v-col cols="1" class="d-flex justify-center align-center">
                <div :style="{ color: setColor(standing.description) }" class=" ml-2 text-center">{{ standing.rank }}
                </div>
              </v-col>

              <v-col cols="1" class="justify-center">
                <v-img max-height="30" :src="standing.team.logo" aspect-ratio="1/1"></v-img>
              </v-col>

              <v-col cols="6" class="d-flex align-center">
                <p class="text-center">{{ standing.team.name }}</p>
              </v-col>

              <v-col cols="1" class="d-flex justify-center align-center">
                <p class="text-center">{{ standing.all.played }}</p>
              </v-col>

              <v-col cols="1" class="d-flex justify-center align-center">
                <p class="text-center">{{ standing.goalsDiff }}</p>
              </v-col>

              <v-col cols="1" class="d-flex justify-center align-center">
                <p class="mr-1 text-center font-weight-bold">{{ standing.points }}</p>
              </v-col>
            </v-row>
            <!-- <v-divider :thickness="1" class="border-opacity-25" color="white"></v-divider> -->

          </v-card>


        </v-card>
      </v-tabs-window-item>

      <v-tabs-window-item :value="3">
        <v-card>
          <!-- {{ lastGames }} -->
          <v-card elevation="16" class="py-1" v-for="(game, index) in lastGames" :key="index"
            @click="openMatchDetails(game)">
            <v-row>
              <v-col class="justify-center">
                <v-card-subtitle class="text-center ">{{ $t('leaguesPage.resultsView.matchDay').toUpperCase() + ' ' + setMatchWeek(game.league.round) + ' | ' +
                  formatTimestamp(game.fixture.timestamp) }}</v-card-subtitle>
              </v-col>
            </v-row>
            <div v-if="!mobile">
              <v-row class="d-flex align-center" justify="center">
                <v-col cols="4" class="d-flex justify-center align-center">
                  <v-card-title>{{ game.teams.home.name }}</v-card-title>
                </v-col>
                <v-col cols="1" class="d-flex justify-center align-center">
                  <v-img max-height="50" :src="game.teams.home.logo" aspect-ratio="1/1"></v-img>
                </v-col>
                <v-col cols="1">
                  <div no-wrap class="text-center text-h4">{{ game.goals.home + '-' + game.goals.away }}
                    <v-card-subtitle  v-if="game.fixture.status.short !== 'FT'" no-wrap class="text-center">{{
                      game.fixture.status.elapsed }}'
                    </v-card-subtitle>
                  </div>
                </v-col>
                <v-col cols="1" class="d-flex justify-center align-center">
                  <v-img max-height="50" :src="game.teams.away.logo" aspect-ratio="1/1"></v-img>
                </v-col>
                <v-col cols="4" class="d-flex justify-center align-center">
                  <v-card-title>{{ game.teams.away.name }}</v-card-title>
                </v-col>
              </v-row>
              <v-progress-linear v-if="game.fixture.status.short !== 'FT'" color="red" height="5"
                :model-value="game.fixture.status.elapsed/90 * 100" striped></v-progress-linear>
            </div>
            <div v-else>
              <v-row class="d-flex align-center" justify="center">
                <v-col cols="4" class="d-flex justify-center align-center">
                  <v-img max-height="50" :src="game.teams.home.logo" aspect-ratio="1/1"></v-img>
                </v-col>
                <v-col cols="4">
                  <div no-wrap class="text-center text-h4">{{ game.goals.home + '-' + game.goals.away }}</div>
                  <v-card-subtitle v-if="game.fixture.status.short !== 'FT'" no-wrap class="text-center">{{
                    game.fixture.status.elapsed }}
                  </v-card-subtitle>
                </v-col>
                <v-col cols="4" class="d-flex justify-center align-center">
                  <v-img max-height="50" :src="game.teams.away.logo" aspect-ratio="1/1"></v-img>
                </v-col>
              </v-row>
              <v-progress-linear v-if="game.fixture.status.short !== 'FT'" color="red" height="5"
                :model-value="game.fixture.status.elapsed / 90 * 100" striped></v-progress-linear>
            </div>

          </v-card>
          <!-- <v-pagination v-model="gameWeek" :length="matchWeeks"></v-pagination> -->
        </v-card>
      </v-tabs-window-item>


      <v-tabs-window-item :value="2">
        <v-card>
          <!-- {{ nextGames }} -->
          <v-card elevation="16" class="py-1" v-for="(game, index) in nextGames" :key="index"
            @click="openMatchDetails(game)">
            <v-row>
              <v-col class="justify-center">
                <v-card-subtitle class="text-center ">{{ $t('leaguesPage.resultsView.matchDay').toUpperCase() + ' ' + setMatchWeek(game.league.round) + ' | ' +
                  formatTimestamp(game.fixture.timestamp) }}</v-card-subtitle>
              </v-col>
            </v-row>
            <div v-if="!mobile">
              <v-row class="d-flex align-center" justify="center">
                <v-col cols="4" class="d-flex justify-center align-center">
                  <v-card-title>{{ game.teams.home.name }}</v-card-title>
                </v-col>
                <v-col cols="1" class="d-flex justify-center align-center">
                  <v-img max-height="50" :src="game.teams.home.logo" aspect-ratio="1/1"></v-img>
                </v-col>
                <v-col cols="1">
                  <div no-wrap class="text-center text-h4"> - </div>
                </v-col>
                <v-col cols="1" class="d-flex justify-center align-center">
                  <v-img max-height="50" :src="game.teams.away.logo" aspect-ratio="1/1"></v-img>
                </v-col>
                <v-col cols="4" class="d-flex justify-center align-center">
                  <v-card-title>{{ game.teams.away.name }}</v-card-title>
                </v-col>

              </v-row>
            </div>
            <div v-else>
              <v-row class="d-flex align-center" justify="center">
                <v-col cols="4" class="d-flex justify-center align-center">
                  <v-img max-height="50" :src="game.teams.home.logo" aspect-ratio="1/1"></v-img>
                </v-col>
                <v-col cols="4">
                  <div no-wrap class="text-center text-h4"> - </div>
                </v-col>
                <v-col cols="4" class="d-flex justify-center align-center">
                  <v-img max-height="50" :src="game.teams.away.logo" aspect-ratio="1/1"></v-img>
                </v-col>
              </v-row>
            </div>

          </v-card>
          <!-- <v-pagination v-model="gameWeek" :length="matchWeeks"></v-pagination> -->
        </v-card>
      </v-tabs-window-item>
    </v-tabs-window>
    <MatchDetails :match="selectedMatch" :is-show="showMatchDetails" @close="closeMatchDetails"></MatchDetails>
  </v-container>
  <v-alert v-else type="warning">Ładowanie...</v-alert>

</template>

<script setup lang="ts">
import { onMounted, computed, ref } from 'vue';
import { useLeagueStore } from '~/stores/leagueStore';
import { useDisplay } from 'vuetify'
import MatchDetails from '~/components/MatchDetails.vue';

const { mobile } = useDisplay()
const route = useRoute()
const leagueId = ref(Number(route.params.leagueId) || 0)

const leagueStore = useLeagueStore();
const leagueData = computed(() => leagueStore.leagueData);
const lastGames = computed(() => leagueStore.lastGamesData)
const nextGames = computed(() => leagueStore.nextGamesData)
const leagueStands = computed(() => leagueStore.leagueStanding)

const tab = ref(0);
const showMatchDetails = ref(false)
const selectedMatch = ref<any | null>(null);

onMounted(() => {
  setAllData()
});

function setColor(place: string) {
  switch (place) {
    case "Champions League":
      return 'green'
    case "Europa League":
      return "orange";
    case "Conference League":
      return "green";
    case "Relegation":
      return "red";
  }
}

function countSeason(season: string) {
  let year = Number(season)
  let result = season + '/' + String(year + 1)
  return result
}

function countDate() {
  const currentDate = new Date();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;
  const day = currentDate.getDate();
  const hours = currentDate.getHours();
  const minutes = currentDate.getMinutes();
  if (minutes / 10 < 1) {
    return `${day}.${month}.${year} ${hours}:0${minutes}`
  }
  return `${day}.${month}.${year} ${hours}:${minutes}`
}

function setAllData() {
  leagueStore.fetchLeagueData(leagueId.value, 2024)
  leagueStore.fetchLastFixturesData(leagueId.value, 2024)
  leagueStore.fetchNextFixturesData(leagueId.value, 2024)
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

function setMatchWeek(input: string): string {
  if (input.length === 0) {
    return '';
  }
  return input.charAt(input.length - 2) + input.charAt(input.length - 1);
}

async function openMatchDetails(game: any) {
  selectedMatch.value = await leagueStore.fetchMatchDetails(game.fixture.id)
  showMatchDetails.value = true;
  console.log(showMatchDetails.value)
}

function closeMatchDetails() {
  showMatchDetails.value = false;
  console.log(showMatchDetails.value)
}
</script>

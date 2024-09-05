<template>
  <v-container v-if="leagueData && fixtures">
    <v-tabs v-model="tab" align-tabs="start" color="primary">
      <v-tab :key="0" value="0">Tabela</v-tab>
      <v-tab :key="1" value="1">Mecze</v-tab>
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
                  <div>{{ 'Sezon: ' + countSeason(leagueData.season) }}</div>
                  <div>{{ 'Ostatnia aktualizacja: ' + countDate() }}</div>
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
                <p class="font-italic ">DRUŻYNA</p>
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
          <v-card elevation="16" class="py-1" v-for="(standing, index) in leagueData.standings[0]" :key="index">
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

      <v-tabs-window-item :value="2">
        <v-card>
          <v-pagination :length="matchWeeks"></v-pagination>
        </v-card>
      </v-tabs-window-item>
    </v-tabs-window>

  </v-container>
  <v-alert v-else type="warning">Ładowanie...</v-alert>
</template>

<script setup lang="ts">
import { onMounted, computed, ref } from 'vue';
import { useLeagueStore } from '~/stores/data';

const leagueStore = useLeagueStore();
const leagueData = computed(() => leagueStore.leagueData);
const fixtures = computed(() => leagueStore.fixturesData)
const matchWeeks = ref(0);
const tab = ref(0);

// watch(leagueData, (newLeagueData) => {
//   matchWeeks = newLeagueData.standings[0].length
//   console.log(matchWeeks)
// })

function countMatchWeeks(counter: number) {
  return counter * 2 - 2
}

onMounted(() => {
  leagueStore.fetchLeagueData(135, 2024); 
  leagueStore.fetchFixturesData(135, 2024); 
  const teams = leagueStore.leagueData.standings[0].length
  matchWeeks.value = countMatchWeeks(teams)
  console.log(matchWeeks)
  // console.log(leagueData)
  console.log(fixtures.value)
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
</script>

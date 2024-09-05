<template>
  <v-container v-if="leagueData">
    <v-card>
      <template v-slot:title>
        <v-row cols="12" align="center">
          <v-col cols="2" class="d-flex justify-center">
            <v-img :src="leagueData.logo" alt="League Logo" class="mb-4" max-height="50"></v-img>
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
            <div :style="{ color: setColor(standing.description) }" class=" ml-2 text-center">{{ standing.rank }}</div>
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
  </v-container>
  <v-alert v-else type="warning">Ładowanie...</v-alert>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useLeagueStore } from '~/stores/data';

const leagueStore = useLeagueStore();
const leagueData = computed(() => leagueStore.leagueData);

onMounted(() => {
  leagueStore.fetchLeagueData(39, 2024); // ID for Premier League
  console.log(leagueData)
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

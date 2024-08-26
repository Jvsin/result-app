<template>
  <v-container v-if="leagueData">
    <v-card>
      <template v-slot:title>
        <v-row cols="12" align="center">
          <v-col cols="4" sm="1">
            <v-img :src="leagueData.logo" alt="League Logo" class="mb-4" :width="100" :height="100"></v-img>
          </v-col>
          <v-col cols="8" sm="11" class="d-flex align-center">
            <span class="text-h4">
              {{ leagueData.name }}
            </span>
          </v-col>
        </v-row>
      </template>

      <v-divider :thickness="4" class="border-opacity-75 mx-5 py-1" color="primary"></v-divider>

      <v-card-text class="pt-4">
        <v-card>
          <v-row class="d-flex align-center">
            <v-col cols="1" class="d-flex justify-center align-center">
              <p class="font-weight-thin">#</p>
            </v-col>

            <v-col cols="1" class="justify-center align-center">
            </v-col>

            <v-col cols="7" class="d-flex align-center">
              <p class="font-italic">DRUŻYNA</p>
            </v-col>

            <v-col cols="1" class="d-flex justify-center align-center">
              <p class="font-italic">M</p>
            </v-col>

            <v-col cols="1" class="d-flex justify-center align-center">
              <p class="font-italic">GD</p>
            </v-col>

            <v-col cols="1" class="d-flex justify-center align-center">
              <p class="font-italic">PTS</p>
            </v-col>
            <v-divider :thickness="1" class="border-opacity-25" color="white"></v-divider>
          </v-row>
        </v-card>
        <v-card elevation="16" class="py-1" v-for="(standing, index) in leagueData.standings[0]" :key="index">
          <v-row class="d-flex align-center">
            <v-col cols="1" class="d-flex justify-center align-center">
              <p class="text-center">{{ standing.rank }}</p>
            </v-col>

            <v-col cols="1" class="justify-center">
              <v-img max-height="30" :src="standing.team.logo" aspect-ratio="1/1"
                ></v-img>
            </v-col>

            <v-col cols="7" class="d-flex align-center">
              <span class="text-center">{{ standing.team.name }}</span>
            </v-col>

            <v-col cols="1" class="d-flex justify-center align-center">
              <p class="text-center">{{ standing.all.played }}</p>
            </v-col>

            <v-col cols="1" class="d-flex justify-center align-center">
              <p class="text-center">{{ standing.goalsDiff }}</p>
            </v-col>

            <v-col cols="1" class="d-flex justify-center align-center">
              <p class="text-center font-weight-bold">{{ standing.points }}</p>
            </v-col>
          </v-row>
          <!-- <v-divider :thickness="1" class="border-opacity-25" color="white"></v-divider> -->

        </v-card>
      </v-card-text>
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
</script>

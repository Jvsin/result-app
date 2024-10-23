<template>
    <v-layout class="rounded rounded-md">
      <v-main class="d-flex align-center justify-center" style="height: 100vh; overflow: hidden;">
        <v-img src="/public/english-league.jpg" cover gradient="to bottom, rgba(0,0,0,.25), rgba(0,0,0,.6)"
          class="text-center w-100 h-100">
          <v-sheet class="d-flex justify-center flex-wrap text-center mx-auto my-10 px-4" elevation="4"
            style="background-color: rgba(0, 0, 0, 0.5); height: 90%; width: 90%;" rounded>
            <v-col>
              <v-card-title class="text-h3">{{ league.name }}</v-card-title>
              <v-card-subtitle class="text-h5">{{ league.league }}</v-card-subtitle>
              <div class="justify-center align-center scrollable-container">
                <v-card class="ma-5 d-flex justify-center align-center" v-for="player in players" variant="text">
                  <v-row class="d-flex align-center">
                    <v-col class="d-flex flex-column align-end align-sm-end justify-center" cols="1">
                      {{ player.position }}
                    </v-col>
                    <v-col cols="2">
                      <v-avatar color="surface-variant"></v-avatar>
                    </v-col>
                    <v-col class="d-flex flex-column align-start justify-center" cols="7">
                      {{ player.name }}
                    </v-col>
                    <v-col class="d-flex flex-column align-center justify-center" cols="2">
                      {{ player.points }}
                    </v-col>
                  </v-row>
                </v-card>
              </div>
            </v-col>

          </v-sheet>
        </v-img>
      </v-main>
    </v-layout>
</template>

<script lang="ts" setup>

const players = [
  { name: "player20", points: 24, position: 1 },
  { name: "player12", points: 22, position: 2 },
  { name: "player16", points: 20, position: 3 },
  { name: "kox12", points: 18, position: 4 },
  { name: "player2", points: 17, position: 5 },
  { name: "player3", points: 12, position: 6 },
  { name: "player_4", points: 10, position: 7 },
  { name: "player_5", points: 7, position: 8 },
  { name: "kicker234", points: 2, position: 9 },
  { name: "name", points: 0, position: 10 },
  // { name: "name", points: 0, position: 10 },
  // { name: "name", points: 0, position: 10 },
  // { name: "name", points: 0, position: 10 },
  // { name: "name", points: 0, position: 10 },
  // { name: "name", points: 0, position: 10 },
  // { name: "name", points: 0, position: 10 },
  // { name: "name", points: 0, position: 10 },
  // { name: "name", points: 0, position: 10 },
  // { name: "name", points: 0, position: 10 },
  // { name: "name", points: 0, position: 10 },
  // { name: "name", points: 0, position: 10 },
  // { name: "name", points: 0, position: 10 },
  // { name: "name", points: 0, position: 10 },
  // { name: "name", points: 0, position: 10 },

]
const league = { name: "Moja liga testowa", position: 4, players: 10, league: "Premier League", icon: "/public/pl.png" }
const img_src = '/public/ucl-league.jpg'

</script>

<style>
.scrollable-container {
  max-height: 700px;
  overflow-y: auto;
}
</style>
<template>
  <v-layout class="rounded rounded-md">
    <v-main class="d-flex align-center justify-center" style="height: 100vh; overflow: hidden;">
      <v-img src="/public/polish-league.jpg" cover gradient="to bottom, rgba(0,0,0,.25), rgba(0,0,0,.6)"
        class="text-center w-100 h-100">

        <v-sheet class="d-flex justify-center flex-wrap text-center mx-auto my-10" elevation="4"
          style="background-color: rgba(0, 0, 0, 0.5); height: 90%; width: 90%;" rounded>
          <v-row>
            <v-col cols="12">
              <v-card-title class="my-2">
                <v-avatar image="/public/poland.png"></v-avatar>
                Ekstraklasa
              </v-card-title>
              <v-tabs v-model="tab" color="primary" class="px-5" grow>
                <v-tab :key="0" value="0"> Twoje wyniki</v-tab>
                <v-tab :key="1" value="1">Typuj</v-tab>
              </v-tabs>
              <v-tabs-window v-model="tab">
                <v-tabs-window-item :value="0">
                  <v-container>
                    tu beda wyniki
                  </v-container>
                </v-tabs-window-item>

                <v-tabs-window-item :value="1">
                  <div class="scrollable-container" style="background-color: rgba(0, 0, 0, 0);">
                    <v-card variant="text" elevation="16" v-for="(game, index) in nextGames" :key="index">
                      <v-row>
                        <v-col class="justify-center">
                          <v-card-subtitle class="text-center ">{{ $t('leaguesPage.resultsView.matchDay').toUpperCase()
                            + ' ' + setMatchWeek(game.league.round) + ' | ' +
                            formatTimestamp(game.fixture.timestamp) }}</v-card-subtitle>
                        </v-col>
                      </v-row>
                      <!-- <div v-if="!mobile"> -->
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
import { useBetStore } from '~/stores/betStore';

definePageMeta({
  middleware: 'auth'
})

const tab = ref(0)
const { mobile } = useDisplay()

const betStore = useBetStore()
const nextGames = computed(() => betStore.nextGames);

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
onMounted(() => {
  betStore.fetchNextGames(106, 2024)
})
</script>

<style>
.scrollable-container {
  max-height: 700px;
  overflow-y: auto;
}
</style>
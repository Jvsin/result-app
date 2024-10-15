<template>
  <v-layout class="rounded rounded-md">
    <v-main class="d-flex align-center justify-center" style="height: 100vh; overflow: hidden;">
      <v-img src="/public/english-league.jpg" cover gradient="to bottom, rgba(0,0,0,.25), rgba(0,0,0,.6)"
        class="text-center w-100 h-100">

        <v-sheet class="d-flex justify-center flex-wrap text-center mx-auto my-10 px-4" elevation="4"
          style="background-color: rgba(0, 0, 0, 0.5); height: 90%; width: 90%;" rounded>
          <v-row>
            <v-col>
              <v-avatar image="/public/england.png"></v-avatar>
              <v-card-title>
                  Premier League
              </v-card-title>
              <v-tabs v-model="tab" color="primary" class="px-5" grow>
                <v-tab :key="0" value="0"> Twoje wyniki</v-tab>
                <v-tab :key="1" value="1">Typuj</v-tab>
              </v-tabs>
            </v-col>
          </v-row>
          <v-container>
            {{ nextGames }}
          </v-container>

        </v-sheet>
      </v-img>
    </v-main>
  </v-layout>
</template>

<script lang="ts" setup>
const tab = ref(0)

const betStore = useBetStore()
const nextGames = computed(() => betStore.nextGames);

onMounted(() => {
  betStore.fetchNextGames(39, 2024)
})
</script>

<style>

</style>
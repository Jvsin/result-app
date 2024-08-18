<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import Navigation from '~/components/Navigation.vue';

const buttons = [
  { value: 'main-page', title: 'Strona Główna' },
  { value: 'pol-1', title: 'Ekstraklasa' },
  { value: 'eng-1', title: 'Premier League' },
  { value: 'ita-1', title: 'Serie A' },
  { value: 'spa-1', title: 'La Liga' },
  { value: 'fra-1', title: 'Ligue 1' },
]

</script>

<template>
  <v-layout class="rounded rounded-md">
    <Navigation/>
    <v-navigation-drawer>
      <v-list>
        <v-list-item v-for="button in buttons" :key="button.value"  >
          <v-btn>{{ button.title }}</v-btn>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main class="d-flex align-center justify-center" style="min-height: 300px;">
      tutaj beda wyniki
    </v-main>
  </v-layout>
</template>



<style>

</style>
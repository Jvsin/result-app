<template>
  <v-navigation-drawer>
    <v-list>
      <v-list-item v-for="button in buttons" :key="button.value">
        <v-btn :to="'/leagues/' + button.value">{{ button.title }}</v-btn>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts" setup>
const buttons = [
  { value: 'pol-1', title: 'Ekstraklasa' },
  { value: 'eng-1', title: 'Premier League' },
  { value: 'ita-1', title: 'Serie A' },
  { value: 'spa-1', title: 'La Liga' },
  { value: 'fra-1', title: 'Ligue 1' },
]
</script>

<style>

</style>
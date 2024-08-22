<template>
  <v-app-bar>
    <v-btn icon="mdi-format-list-bulleted" v-if="isMdAndDown" @click="drawer = !drawer"
      class="d-flex align-center justify-center" />

    <v-btn :class="isSmAndDown ? '' : 'ml-2'" variant="text" color="primary" :active="false" to="/"
      text="Match Results App" class="d-flex align-center justify-center" />
  </v-app-bar>

  <v-navigation-drawer v-if="isMdAndDown" v-model="drawer">
    <v-list>
      <v-list-item v-for="button in buttons" :key="button.value">
        <v-btn :to="'/leagues/' + button.value">{{ button.title }}</v-btn>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>

  <v-navigation-drawer v-if="isSmAndUp">
    <v-list>
      <v-list-item v-for="button in buttons" :key="button.value">
        <v-btn :to="'/leagues/' + button.value">{{ button.title }}</v-btn>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { ref } from "vue";
import { useDisplay } from "vuetify";

const drawer = ref(false);
const { mdAndUp, smAndDown, smAndUp, mdAndDown } = useDisplay()
const isSmAndDown = smAndDown
const isMdAndUp = mdAndUp
const isMdAndDown = mdAndDown
const isSmAndUp = smAndUp

const buttons = [
  { value: "pol-1", title: "Ekstraklasa" },
  { value: "eng-1", title: "Premier League" },
  { value: "ita-1", title: "Serie A" },
  { value: "spa-1", title: "La Liga" },
  { value: "fra-1", title: "Ligue 1" },
];

watch((mdAndUp, smAndDown) => {
  // console.log('isSmallAndDown: ' + isSmAndDown.value)
  // console.log('isMdAndUp: ' + isMdAndUp.value)
})
</script>

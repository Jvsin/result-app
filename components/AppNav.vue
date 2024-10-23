<template>
  <v-app-bar>
    <v-btn icon="mdi-format-list-bulleted" @click="drawer = !drawer"
      class="d-flex align-center justify-center" />

    <v-btn :class="isSmAndDown ? '' : 'ml-2'" variant="text" color="primary" :active="false" to="/"
      text="Match Results App" class="d-flex align-center justify-center" />

    <v-spacer></v-spacer>

    <!-- <v-select v-if="!isSmAndDown" v-model="locale" variant="plain" hide-details :items="languages" dense
      style="max-width: 120px;" class="d-flex align-center justify-center" /> -->
  </v-app-bar>

  <v-navigation-drawer v-model="drawer">
    <v-list>
      <v-list-item v-for="button in buttons" :key="button.value">
        <v-btn @click="getRoute(button.id)">{{ button.title }}</v-btn>
      </v-list-item>
    </v-list>
    <v-divider></v-divider>
    <div class="language-selector">
      <v-select v-model="locale" class="mx-2 my-4" variant="plain" hide-details :items="languages" dense
        style="max-width: 120px;" />
    </div>
  </v-navigation-drawer>

  <!-- <v-navigation-drawer v-if="isSmAndUp">
    <v-list>
      <v-list-item v-for="button in buttons" :key="button.value">
        <v-btn @click="getRoute(button.id)">{{ button.title }}</v-btn>
      </v-list-item>
    </v-list>
    <div class="language-selector">
      <v-select v-model="locale" class="mx-2 my-4" variant="plain" hide-details :items="languages" dense
        style="max-width: 120px;" />
    </div>
  </v-navigation-drawer> -->
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

const router = useRouter();
const address = computed(() => `/leagues/${buttons.value?.id}`)

function getRoute(value ) {
  console.log('Navigating to /leagues/' + value);
  router.push(`/leagues/${value}`);
}

const { t, locale } = useI18n()

const languages = [
  { title: "Polski", value: 'pl' },
  { title: "English", value: 'en' },
]

const buttons = [
  { value: 'ucl', title: 'Champions League', id: 2 },
  { value: 'uel', title: 'Europa League', id: 3 },
  { value: 'uecl', title: 'Conference League', id: 848 },
  { value: "pol-1", title: "Ekstraklasa", id: 106},
  { value: "eng-1", title: "Premier League", id: 39 },
  { value: "ita-1", title: "Serie A", id: 135 },
  { value: "spa-1", title: "La Liga", id: 140 },
  { value: "ger-1", title: "Bundesliga", id: 78},
  { value: "fra-1", title: "Ligue 1", id: 61},
  
];

watch((mdAndUp, smAndDown) => {
  // console.log('isSmallAndDown: ' + isSmAndDown.value)
  // console.log('isMdAndUp: ' + isMdAndUp.value)
})
</script>

<style scoped>
.language-selector {
  position: absolute;
  bottom: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>

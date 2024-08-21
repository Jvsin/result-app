<script setup lang="ts">
import { useDisplay } from "vuetify";

// const { t, locale } = useI18n()

// const languages = [
//   { title: t('lang.pl'), value: 'pl' },
//   { title: t('lang.en'), value: 'en' },
// ]

const route = useRoute();
const activePath = computed(() => route.fullPath);

// watch(locale, (newLocale, oldLocal) => {
//   if (newLocale !== oldLocal && userData.value)
//     userStore.updateLang(newLocale as 'en' | 'pl')
// })

const { mobile } = useDisplay();
const drawer = ref(false);
const themeItems = [
  { title: "Jasny", value: "light" },
  { title: "Ciemny", value: "dark" },
];
const buttons = [
  { value: "pol-1", title: "Ekstraklasa" },
  { value: "eng-1", title: "Premier League" },
  { value: "ita-1", title: "Serie A" },
  { value: "spa-1", title: "La Liga" },
  { value: "fra-1", title: "Ligue 1" },
];

function onClickDrawerItem() {
  if (mobile.value) drawer.value = false;
}
</script>

<template>
  <v-app-bar>
    <template #prepend>
      <v-app-bar-nav-icon v-if="mobile" @click.stop="drawer = !drawer" />
    </template>

    <v-btn
      :class="mobile ? '' : 'ml-2'"
      variant="text"
      color="primary"
      :active="false"
      to="/"
      prepend-icon="mdi-home"
      text="Match Results App"
    />

    <v-spacer />

    <div v-if="!mobile" class="flex align-center">
      <v-select
        class="mx-2"
        variant="plain"
        hide-details
        :items="themeItems"
        label="Motyw"
      />
    </div>

    <v-menu>
      <template #activator="{ props }">
        <v-btn color="primary" variant="elevated" v-bind="props" icon>
          <v-avatar size="40" />
        </v-btn>
      </template>
      <v-list>
        <v-list-subheader> User </v-list-subheader>

        <v-list-item append-icon="mdi-logout" />
      </v-list>
    </v-menu>
  </v-app-bar>

  <v-navigation-drawer temporary>
    <v-list>
      <v-list-item v-for="button in buttons" :key="button.value">
        <v-btn :to="'/leagues/' + button.value">{{ button.title }}</v-btn>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>

  <!-- <v-layout class="rounded">
    <v-app-bar class="px-2 position-sticky" color="primary">
      <v-btn variant="text" color="default" to="/">
        app
      </v-btn>

      <v-spacer />

      <div class="hidden-sm-and-down">

        <v-btn to="/user/meet" variant="text" color="default" prepend-icon="mdi-heart">
          button
        </v-btn>

        <v-btn to="/user/chat" variant="text" color="default" prepend-icon="mdi-chat">
          button
        </v-btn>
      </div>

      <v-spacer />

      <div class="hidden-xs">

      </div>

      <div class="hidden-md-and-up">
        <v-btn class="rounded-xl mr-2" color="default" icon @click.stop="drawer = !drawer">
          <v-icon icon="mdi-menu" />
        </v-btn>
      </div>

    </v-app-bar> -->

  <!-- <v-navigation-drawer temporary>
      <v-list>
        <v-list-item v-for="button in buttons" :key="button.value">
          <v-btn :to="'/leagues/' + button.value">{{ button.title }}</v-btn>
        </v-list-item>
      </v-list>
    </v-navigation-drawer> -->
  <!-- </v-layout> -->
</template>

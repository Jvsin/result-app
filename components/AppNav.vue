<template>
  <v-app-bar>
    <v-btn icon="mdi-format-list-bulleted" @click="drawer = !drawer"
      class="d-flex align-center justify-center" />

    <v-btn v-if="!user" :class="isSmAndDown ? '' : 'ml-2'" variant="text" color="primary" :active="false" to="/"
      text="Match Results App" class="d-flex align-center justify-center" />
    <v-btn v-else :class="isSmAndDown ? '' : 'ml-2'" variant="text" color="primary" :active="false" to="/user"
      text="Match Results App" class="d-flex align-center justify-center" />  

    <v-spacer></v-spacer>
  
    <v-btn v-if="user" class="mr-2" color="primary" size="large">
      <v-icon class="mx-2">mdi-account-circle</v-icon> {{ user.nick.toUpperCase() }}
      <v-menu  activator="parent">
        <v-list class="justify-center">
          <v-list-item to="/user" prepend-icon="mdi-face-man-profile" :title="$t('user.profile')" />
          <v-list-item prepend-icon="mdi-logout" :title="$t('user.logout')" @click="logOut" />
        </v-list>
      </v-menu>
    </v-btn>
    <v-btn v-else color="primary" size="large">
      <v-icon class="mx-2">mdi-account-circle</v-icon>MENU
      <v-menu  activator="parent">
        <v-list class="justify-center">
          <v-list-item to="/auth/login" prepend-icon="mdi-soccer" :title="$t('auth.login.login')" />
          <v-list-item to="/auth/register" prepend-icon="mdi-soccer" :title="$t('auth.register.register')" />
        </v-list>
      </v-menu>
    </v-btn>
  </v-app-bar>
  

  <v-navigation-drawer v-model="drawer">
    <v-list>
      <v-list-item v-for="button in buttons" :key="button.value">
        <v-btn @click="getRoute(button.id)">{{ button.title }}</v-btn>
      </v-list-item>
    </v-list>
    <div v-if="user">
      <v-list>
        <v-list-item v-for="league in favLeagues" :key="league.value">
          <v-btn @click="getRoute(league.id)">{{ truncateText(league.name, 15) }}</v-btn>
        </v-list-item>
      </v-list>
    </div>
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

const authStore = useAuthStore()
const user = computed(() => authStore.loggedUserData)

const favLeagues = computed(() => {
   if (!user.value) return []
  return user.value.favLeagues
})

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

watch(favLeagues, (oldl, newl) => {
  console.log(favLeagues)
})

async function logOut() {
  await authStore.logout()
  router.push('/')
}

function truncateText(text, maxLength) {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    } else {
      return text;
    }
  }
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

<template>
  <v-dialog :model-value="isShowRef" max-width="1000" @update:model-value="close" >
    <v-card>   
      <v-card-title class="px-5">
        Ulubione ligi
      </v-card-title>
      <v-tabs v-model="tab" align-tabs="start" color="primary" grow>
        <v-tab :key="0" value="0">Dodaj ligi</v-tab>
        <v-tab :key="1" value="1">Obserwowane ligi</v-tab>
      </v-tabs>

      <v-tabs-window v-model="tab">
        <v-tabs-window-item :value="0">
          <v-card-text class="px-5" justify="center">
            Aby szybko przeglądać wyniki swoich ulubionych lig, wybierz kraj z listy, a następnie zainteresowaną ligę. 
            Będzie ona dostępna w nawigacji po lewej stronie ekranu.
          </v-card-text>

          <v-row justify="center" align="center" class="px-5">
            <v-col cols="12" sm="10">
              <v-combobox :items="countries"
              label="Select a country"
              v-model="selectedCountry"
              filterable>
              </v-combobox>
            </v-col>
            <v-col cols="12" sm="2"  class="d-flex justify-center align-center">
              <v-btn color="primary" variant="outlined" class="mb-5" size="large" @click="fetchLeagues">Szukaj</v-btn> 
            </v-col>
          </v-row>
      
          <div v-if="leaguesFound.length">
            <v-select
              v-model="selectedLeague"
              item-title="name"
              item-value="id"
              class="px-5" 
              :items="leaguesFound"
              label="Wybierz ligę"
              return-object
            ></v-select>  
          </div>

          <v-alert v-if="error" type="error" class="px-5" :timeout="5000">
            {{ $t(`errors.login.${error}`) }}
          </v-alert>

          <v-card-actions>
            <v-btn color="error" @click="close">Anuluj</v-btn>
            <v-btn color="primary" @click="saveData">Zapisz</v-btn>
          </v-card-actions>
        </v-tabs-window-item>

        <v-tabs-window-item :value="1">
          <div v-if="favLeagues.length">
            <v-card variant="flat" v-for="league in favLeagues" class="px-2">
              <v-row class="d-flex align-center">
                <v-col cols="6" md="8">
                  <v-card-title>
                    {{ league.name }}
                  </v-card-title>
                </v-col>
                <v-col>
                  <v-card-subtitle cols="2" md="2">
                     {{ league.id }}
                  </v-card-subtitle>
                </v-col>
                <v-col cols="3" md="1">
                  <v-btn color="error" @click="deleteLeague(league.id)"><v-icon left>mdi-delete</v-icon></v-btn>
                </v-col>
              </v-row>
            </v-card>
          </div>
          <div v-else>
            <v-row justify="center">
              <v-col cols="auto" class=" d-flex align-center justify-center">
                <v-icon left>mdi-close</v-icon>
                <v-card-text class="text-h5">
                  Nie obserwujesz żadnych lig
                </v-card-text>
             </v-col>
            </v-row>
          </div>
        </v-tabs-window-item>
      </v-tabs-window>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import type { UserModel } from '~/models/user';
import { useAuthStore } from '~/stores/authStore';
import allCountries from '~/composables/countries.json'
import { useI18n } from 'vue-i18n'

const tab = ref(0)
const { locale } = useI18n()

const countries = computed(() => {
  return allCountries.map((country: { en: string; pl: string }) => country[locale.value as keyof typeof country]);
});

const authStore = useAuthStore()
const leagueStore = useLeagueStore()

const selectedCountry = ref<string>('')
const countryToSearch = ref<string>('')
const leaguesFound = ref<any>([])
const selectedLeague = ref<any>()
const error = ref<string>('')

const props = defineProps<{
  user: UserModel | null,
  isShow: boolean
}>()

const emit = defineEmits<{
  (e: 'onClose'): void
}>()

function close() {
  resetState()
  emit('onClose')
}

const { user, isShow } = toRefs(props)
const isShowRef = ref<boolean>()
const userId = ref<string | undefined>()

const favLeagues = user.value?.favLeagues || [];


function resetState() {
  selectedCountry.value = ''
  countryToSearch.value = ''
  leaguesFound.value = []
  error.value = ''
}

async function saveData() {
  if (user.value != null)
    userId.value = user.value.reference?.id

  // const favLeagues = user.value?.favLeagues || [];
  const leagueExists = favLeagues.some((league: any) => league.id === selectedLeague.value.id);
  if (!leagueExists) {
    const updatedFavLeagues = [...favLeagues, {id: selectedLeague.value.id, name: selectedLeague.value.name}]
    const newData = {
      uid: userId.value,
      favLeagues: updatedFavLeagues
    }
    try {
      await authStore.editProfile(newData)
      favLeagues.push({id: selectedLeague.value.id, name: selectedLeague.value.name})
      close()
    } catch (e) {
      console.log(e)
      error.value = 'errorWhileEditingProfile'
    }
  } else {
    error.value = 'leagueAlreadyExist'
  }
}

async function fetchLeagues() {
  if (leaguesFound.value.length)
    leaguesFound.value = []
  if (error.value.length)
    error.value = ''
  try {
    await leagueStore.fetchLeaguesFromCountry(countryToSearch.value)
    for (const item in leagueStore.searchedLeagues) {
      const leagueData = leagueStore.searchedLeagues[item] as any;
      const league = {
        id: leagueData.league.id,
        name: leagueData.league.name.toString(),
        logo: leagueData.league.logo
      }
      leaguesFound.value.push(league)
    }
    console.log(leaguesFound.value)
    if (!leaguesFound.value.length)
      error.value = 'leaguesNotFound'
  }
  catch (e) {
    console.log(e)
  }
}

async function deleteLeague(leagueId: Number) {
  if (user.value != null)
    userId.value = user.value.reference?.id
  try {
    const afterDeleteLeagues = favLeagues.filter((league: any) => league.id !== leagueId);
    console.log(afterDeleteLeagues)
    const newData = {
      uid: userId.value,
      favLeagues: afterDeleteLeagues
    }
    await authStore.editProfile(newData)
    
    const indexToRemove = favLeagues.findIndex(league => league.id === leagueId);
    if (indexToRemove !== -1) {
      favLeagues.splice(indexToRemove, 1);
    }
  } catch (e) {
    console.log(e)
  }
}

watch(selectedCountry, (newValue) => {
  const countryObj = allCountries.find(country => country.pl === newValue || country.en === newValue);
  if (countryObj) {
    countryToSearch.value = countryObj.en; 
  }
});

watch(isShow, (newVal) => {
  isShowRef.value = newVal;
  if (newVal) {
  }
});

onMounted(() => {
  console.log(user.value?.favLeagues)
})
</script>

<style>

</style>
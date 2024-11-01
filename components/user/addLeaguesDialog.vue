<template>
  <v-dialog :model-value="isShowRef" max-width="700" @update:model-value="close" >
    <v-card>
      <v-card-title class="px-5">
        Edytuj własne ligi
      </v-card-title>
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
        <v-col cols="12" sm="2">
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
      
      
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import type { UserModel } from '~/models/user';
import { useAuthStore } from '~/stores/authStore';
import allCountries from '~/composables/countries.json'
import { useI18n } from 'vue-i18n'

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

function resetState() {
  selectedCountry.value = ''
  countryToSearch.value = ''
  leaguesFound.value = []
  error.value = ''
}

async function saveData() {
  if (user.value != null)
    userId.value = user.value.reference?.id
  
  const favLeagues = user.value?.favLeagues || [];
  const leagueExists = favLeagues.some((league: any) => league.id === selectedLeague.value.id);
  if (!leagueExists) {
    const newData = {
      uid: userId.value,
      favLeague: {id: selectedLeague.value.id, name: selectedLeague.value.name}
    }
    try {
      await authStore.editProfile(newData)
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
</script>

<style>

</style>
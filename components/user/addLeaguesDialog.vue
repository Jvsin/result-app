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

      <v-row justify="center" align="center" class="px-1">
        <v-col cols="12" sm="10">
          <v-combobox class="px-5" :items="countries"
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
        <v-select :items="leaguesFound.name"
        label="Wybierz ligę"
        ></v-select>  
      </div>
      <v-card-actions>
        <v-btn color="error" @click="close">Anuluj</v-btn>
        <v-btn color="primary" @click="close">Zapisz</v-btn>
      </v-card-actions>
      <!-- <div>{{ leaguesFound }}</div> -->
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

function resetState() {
  selectedCountry.value = ''
  countryToSearch.value = ''
  leaguesFound.value = []
}

async function fetchLeagues() {
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
<template>
  <v-dialog :model-value="isShowRef" max-width="700" scrollable @update:model-value="close" >
    <v-card>
      <v-card-title class="px-5">
        Edytuj własne ligi
      </v-card-title>
      <v-card-text class="px-5" justify="center">
        Aby szybko przeglądać wyniki swoich ulubionych lig, wybierz kraj z listy, a następnie zainteresowaną ligę. 
        Będzie ona dostępna w nawigacji po lewej stronie ekranu.
      </v-card-text>
  
      <v-combobox class="px-5" :items="countries"
          label="Select a country"
          v-model="selectedCountry"
          filterable>
      </v-combobox>

      
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import type { UserModel } from '~/models/user';
import { useAuthStore } from '~/stores/authStore';
import englishCountries from '~/composables/countries_en.json'
import polishCountries from '~/composables/countries_pl.json'
import allCountries from '~/composables/countries.json'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

const countries = computed(() => {
      return allCountries.map((country: { en: string; pl: string }) => country[locale.value as keyof typeof country]);
    });

const authStore = useAuthStore()

const selectedCountry = ref<string>('')
const countryToSearch = ref<string>('')

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

setData()

function resetState() {
  
}

function setData() {

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
    setData();
  }
});
</script>

<style>

</style>
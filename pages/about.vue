<template>
  <div>
    <h1>{{ $t('welcome') }}</h1>
    <p>{{ $t('hello') }}</p>

    <select v-model="currentLanguage" @change="changeLanguage">
      <option v-for="locale in locales" :key="locale.code" :value="locale.code">
        {{ locale.name }}
      </option>
    </select>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

const locales = [
  { code: 'pl', name: 'Polski' },
  { code: 'en', name: 'English' },
]

const currentLanguage = ref(locale.value)

function changeLanguage(event) {
  locale.value = event.target.value
}
</script>

<style scoped>
</style>

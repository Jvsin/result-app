<script setup lang="ts">
import type AppBar from './components/AppBar.vue';
</script>

<template>
  <NuxtLayout>
    <v-app>
      <v-main>
        <AppBar />
        <Navigation />
        <NuxtPage />
      </v-main>
    </v-app>
  </NuxtLayout>
</template>
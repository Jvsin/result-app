<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

const router = useRouter()

</script>

<template>
  <v-layout class="rounded rounded-md">
    <v-main class="d-flex align-center justify-center" style="min-height: 300px;">
      <v-img src="/main.jpg" cover gradient="to bottom, rgba(0,0,0,.25), rgba(0,0,0,.7)" class="mt-15 text-center">
        <div class="d-flex flex-column align-center justify-center h-50 mx-4">
          <span class="text-h3 font-weight-bold text-white">
            MATCH RESULTS APP
          </span>

          <p class="mt-2 text-white">
            Stwórz własną ligę i typuj razem ze swoimi znajomymi!
          </p>

          <v-btn class="my-4" to="auth/login" variant="elevated" color="secondary">
            Dołącz już teraz
          </v-btn>
        </div>
      </v-img>
    </v-main>
  </v-layout>
</template>



<style>

</style>
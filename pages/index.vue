<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

const router = useRouter()

</script>

<template>
  <v-layout class="rounded rounded-md">
    <v-main class="d-flex align-center justify-center" style="height: 100vh;">
      <v-img src="/main.jpg" cover gradient="to bottom, rgba(0,0,0,.25), rgba(0,0,0,.7)"
        class="text-center w-100 h-100">
        <div class="d-flex flex-column align-center justify-center h-100 w-100 mx-4">
          <span class="text-h3 font-weight-bold text-white">
          {{ $t("appName") }}
          </span>

          <p class="mt-2 text-white">
            {{ $t("landingPage.description") }}
          </p>

          <v-btn class="my-4" to="auth/register" variant="elevated" color="secondary">
            {{ $t("landingPage.join") }}
          </v-btn>
        </div>
      </v-img>
    </v-main>


  </v-layout>
</template>



<style>

</style>
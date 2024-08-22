<template>
  <v-layout class="d-flex align-center justify-center" style="height: 100vh;">
    <v-img src="/grass.jpg" cover gradient="to bottom, rgba(0,0,0,.25), rgba(0,0,0,.7)" class="text-center w-100 h-100">
      <v-row justify="center" align="center" class="h-100">
        <v-col cols="12" sm="12" md="6" class="d-flex justify-center align-center">
          <div class="flex-column align-center justify-center mx-2 py-5"
            style="background-color: rgba(0, 0, 0, 0.5); width: 100%; max-width: 500px;">
            <v-spacer />
            <span class="text-h3 font-weight-bold text-white">
              ZAREJESTRUJ SIĘ
            </span>
            
            <v-btn color="secondary" prepend-icon="mdi-google">
              Rejestracja przez Google
            </v-btn>

            <form class="mx-5 py-2">
              <v-text-field v-model="email" label="Adres Email"></v-text-field>

              <v-text-field v-model="nickName" label="Nick"></v-text-field>

              <v-text-field v-model="name" label="Imię"></v-text-field>
              <v-text-field v-model="surname" label="Nazwisko"></v-text-field>
              <v-text-field v-model="password1" label="Hasło"></v-text-field>
              <v-text-field v-model="password2" label="Powtórz hasło"></v-text-field>

              <v-btn class="me-4" type="submit" color="primary">
                Zarejestruj się
              </v-btn>

              <v-btn @click="handleReset" color="error">
                Wyczyść
              </v-btn>
            </form>
          </div>
        </v-col>
      </v-row>
    </v-img>
  </v-layout>

</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'

import { storeToRefs } from 'pinia'
const nickName = ref('')
const email = ref('')
const name = ref('')
const surname = ref('')
const password1 = ref('')
const password2 = ref('')

function handleReset() {
  nickName.value = ''
  email.value = ''
  name.value = ''
  surname.value = ''
  password1.value = ''
  password2.value = ''
}
</script>

<style>

</style>
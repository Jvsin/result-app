<template>
  
    <v-img src="/register-background.jpg" cover gradient="to bottom, rgba(0,0,0,.25), rgba(0,0,0,.7)"
      class="text-center w-100 h-100">
      <v-row justify="center">
        <v-col cols="12" sm="12" md="6">
          <div class=" flex-column align-center justify-center h-100 mx-2 py-5">
            <form>
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
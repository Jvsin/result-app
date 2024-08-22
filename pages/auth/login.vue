<template>
  <v-layout class="d-flex align-center justify-center" style="height: 100vh;">
    <v-img src="/grass.jpg" cover gradient="to bottom, rgba(0,0,0,.25), rgba(0,0,0,.7)" class="text-center w-100 h-100">
      <v-row justify="center" align="center" class="h-100">
        <v-col cols="12" sm="12" md="6" class="d-flex justify-center align-center">
          <div class="flex-column align-center justify-center mx-2 py-5"
            style="background-color: rgba(0, 0, 0, 0.5); width: 100%; max-width: 500px;">
            <span class="text-h3 font-weight-bold text-white">
              LOGOWANIE
            </span>

            <div class="mx-5 py-2">
              <v-btn color="secondary" variant="outlined" prepend-icon="mdi-google">
                Zaloguj przez Google
              </v-btn>
            </div>

            <v-form class="mx-5 py-2" v-model="valid">

              <v-text-field v-model="nickName" label="Nick" :rules="[requiredRule()]"></v-text-field>

              <v-text-field v-model="password" :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                label="Hasło" :type="showPassword ? 'text' : 'password'"
                @click:append-inner="showPassword = !showPassword"
                :rules="[requiredRule(), passwordRule()]"></v-text-field>

              <v-btn class="mx-5 py-2" variant="outlined" type="submit" color="primary">
                Zaloguj się
              </v-btn>

            </v-form>
            <v-divider :thickness="4" class="border-opacity-75 mx-5 py-1" color="primary"></v-divider>
            <span class="text-h5 font-weight-bold text-white">
              Nie posiadasz konta? Dołącz już teraz
            </span>
            <div class="mx-5 py-2">
              <v-btn to="/auth/register" variant="outlined" color="primary">
                Rejestracja
              </v-btn>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-img>
  </v-layout>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import formValidation from "~/composables/formValidation";
import { emailRule, lengthRule, lengthRuleShort, passwordRule, requiredRule, surnameLengthRule } from "~/composables/rules";

const { form, valid, isValid } = formValidation()
const showPassword = ref(false)
const nickName = ref('')
const password = ref('')

function loginUser() {
  const nickName = ''
  const password = ''
}
</script>

<style>

</style>
<template>
  <v-layout class="d-flex align-center justify-center" style="height: 100vh;">
    <v-img src="/grass.jpg" cover gradient="to bottom, rgba(0,0,0,.25), rgba(0,0,0,.7)" class="text-center w-100 h-100">
      <v-row justify="center" align="center" class="h-100">
        <v-col cols="12" sm="12" md="6" class="d-flex justify-center align-center">
          <div class="flex-column align-center justify-center mx-2 py-5"
            style="background-color: rgba(0, 0, 0, 0.5); width: 100%; max-width: 500px;">
            <span class="text-h3 font-weight-bold text-white">
              {{ $t("auth.login.login").toUpperCase() }}
            </span>

            <div class="mx-5 py-2">
              <v-btn color="secondary" variant="outlined" prepend-icon="mdi-google">
                {{ $t('auth.login.loginWithGoogle') }}
              </v-btn>
            </div>

            <v-form class="mx-5 py-2" v-model="valid" @submit.prevent="loginUser">

              <v-text-field v-model="email" :label="$t('auth.login.nickOrEmail')"
                :rules="[requiredRule(), emailRule()]"></v-text-field>

              <v-text-field v-model="password" :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                :label="$t('auth.login.password')" :type="showPassword ? 'text' : 'password'"
                @click:append-inner="showPassword = !showPassword"
                :rules="[requiredRule(), passwordRule()]"></v-text-field>

              <v-alert v-if="error" type="error" class="my-2">
                {{ $t(`errors.login.${error}`) }}
              </v-alert>

              <v-btn class="mx-5 py-2" variant="outlined" type="submit" color="primary">
                {{ $t('auth.login.loginButton') }}
              </v-btn>

            </v-form>
            <v-divider :thickness="4" class="border-opacity-75 mx-5 py-1" color="primary"></v-divider>
            <span class="text-h5 font-weight-bold text-white">
              {{ $t('auth.login.goToRegister') }}
            </span>
            <div class="mx-5 py-2">
              <v-btn to="/auth/register" variant="outlined" color="primary">
                {{ $t('auth.login.registerButton') }}
              </v-btn>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-img>
  </v-layout>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { signInWithEmailAndPassword } from 'firebase/auth'
import formValidation from "~/composables/formValidation"
import { emailRule, passwordRule, requiredRule } from "~/composables/rules"

const { valid } = formValidation()

const showPassword = ref(false)
const email = ref('')
const password = ref('')
const error = ref<string | null>(null)
const loading = ref(false)

const router = useRouter()

const authStore = useAuthStore()

async function loginUser() {
  loading.value = true
  error.value = null
  try {
    await authStore.loginWithPassword(email.value, password.value)
    if (authStore.error) {
      error.value = authStore.error
      console.log(error.value)
    }
    else { 
      router.push('/user')
    }
  } catch (err: any) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}
</script>

<style>
/* Your styles here */
</style>

<template>
  <v-layout class="d-flex align-center justify-center" style="height: 100vh;">
    <v-img src="/grass.jpg" cover gradient="to bottom, rgba(0,0,0,.25), rgba(0,0,0,.7)" class="text-center w-100 h-100">
      <v-row justify="center" align="center" class="h-100">
        <v-col cols="12" sm="12" md="6" class="d-flex justify-center align-center">
          <div class="flex-column align-center justify-center mx-2 py-5"
            style="background-color: rgba(0, 0, 0, 0.5); width: 100%; max-width: 500px;">
            <span class="text-h5 font-weight-bold text-white">
              {{ $t("auth.register.goToLogin") }}
            </span>
            <div class="mx-5 py-2">
              <v-btn to="/auth/login" variant="outlined" color="primary">
                {{ $t("auth.register.loginButton") }}
              </v-btn>
            </div>

            <v-divider :thickness="4" class="border-opacity-75 mx-5 py-1" color="success"></v-divider>
            <span class="text-h3 font-weight-bold text-white">
              {{ $t("auth.register.register").toUpperCase() }}
            </span>

            <div class="mx-5 py-2">
              <v-btn color="secondary" variant="outlined" prepend-icon="mdi-google">
                {{ $t("auth.register.registerWithGoogle") }}
              </v-btn>
            </div>

            <v-form class="mx-5 py-2" v-model="valid" ref="form">
              <v-text-field v-model="email" :label="$t('auth.register.email')"
                :rules="[requiredRule(), emailRule()]"></v-text-field>

              <v-text-field v-model="nickName" :label="$t('auth.register.nick')"
                :rules="[requiredRule(), lengthRuleShort(), lengthRule()]"></v-text-field>

              <v-text-field v-model="name" :label="$t('auth.register.name')"
                :rules="[requiredRule(), lengthRuleShort(), lengthRule()]"></v-text-field>
              <v-text-field v-model="surname" :label="$t('auth.register.surname')"
                :rules="[requiredRule(), lengthRuleShort(), surnameLengthRule()]"></v-text-field>

              <!-- <v-checkbox @click="showPasswords = !showPasswords" label="Pokaż hasła"></v-checkbox> -->
              <v-text-field v-model="password1" :type="showPasswords ? 'text' : 'password'"
                :append-inner-icon="showPasswords ? 'mdi-eye' : 'mdi-eye-off'" :label="$t('auth.register.password')"
                @click:append-inner="showPasswords = !showPasswords"
                :rules="[requiredRule(), passwordRule()]"></v-text-field>
              <v-text-field v-model="password2" :type="showPasswords ? 'text' : 'password'"
                :append-inner-icon="showPasswords ? 'mdi-eye' : 'mdi-eye-off'"
                :label="$t('auth.register.repeatPassword')" @click:append-inner="showPasswords = !showPasswords"
                :rules="[requiredRule(), passwordRule()]"></v-text-field>

              <v-btn class="me-4" @click="registerUser" variant="outlined" type="submit" color="primary">
                {{ $t("auth.register.registerButton") }}
              </v-btn>

              <v-btn variant="outlined" @click="handleReset" color="error">
                {{ $t("auth.register.clear") }}
              </v-btn>
            </v-form>
          </div>
        </v-col>
      </v-row>
    </v-img>
  </v-layout>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import { emailRule, lengthRule, lengthRuleShort, passwordRule, requiredRule, surnameLengthRule } from '~/composables/rules';
import formValidation from '~/composables/formValidation';
import { type IUser, UserModel } from '~/models/user';

const { valid } = formValidation();

const router = useRouter();
const authStore = useAuthStore();

const nickName = ref('');
const email = ref('');
const name = ref('');
const surname = ref('');
const password1 = ref('');
const password2 = ref('');

const showPasswords = ref(false);

function comparePasswords() {
  return password1.value === password2.value;
}

function handleReset() {
  nickName.value = '';
  email.value = '';
  name.value = '';
  surname.value = '';
  password1.value = '';
  password2.value = '';
}

async function registerUser() {
  if (!comparePasswords()) {
    alert("Passwords do not match");
    return;
  }

  const userData: IUser = {
    email: email.value,
    nick: nickName.value,
    name: name.value,
    surname: surname.value,
    favLeagues: [],
    photo: '',
    role: 'user',
    leagues: []
  };

  try {
    await authStore.registerWithPassword(email.value, password1.value, userData);
    handleReset();
    router.push('/user');  
  } catch (error) {
    console.error('Error registering user:', error);
  }
}
</script>

<style>
/* Your styles here */
</style>

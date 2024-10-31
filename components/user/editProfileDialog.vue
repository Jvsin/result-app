<template>
  <v-dialog :model-value="isShowRef" max-width="700" scrollable @update:model-value="close" >
    <v-card>
      <v-card-title class="px-5">
        {{ $t('user.editProfile') }}
      </v-card-title>
      <v-form ref="form" v-model="valid" class="px-5" @submit.prevent="editProfile">
        <v-text-field :label="$t('auth.register.nick')" v-model="newNick" variant="outlined" :rules="[requiredRule(), lengthRule()]"></v-text-field>
        <v-text-field :label="$t('auth.register.name')" v-model="newName" variant="outlined" :rules="[requiredRule(), lengthRule()]"></v-text-field>
        <v-text-field :label="$t('auth.register.surname')" v-model="newSurname" variant="outlined" :rules="[requiredRule(), lengthRule()]"></v-text-field>
      </v-form>
      <v-card-actions>
        <v-btn color="error" @click="close">Anuluj</v-btn>
        <v-btn color="primary" @click="editProfile">Zapisz</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import type { UserModel } from '~/models/user';
import formValidation from '~/composables/formValidation'
import { lengthRule, requiredRule } from '~/composables/rules'
import { useAuthStore } from '~/stores/authStore';

const authStore = useAuthStore()
const { form, valid, isValid } = formValidation()

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

const newName = ref<string>('')
const newSurname = ref<string>('')
const newNick = ref<string>('')
const uid = ref<string | undefined>('')
setData()

async function editProfile() {
  const userData = {
    uid: uid.value,
    nick: newNick.value,
    name: newName.value,
    surname: newSurname.value,
  };
  if (await isValid()) {
    await authStore.editProfile(userData)
    close()
  }
}

function resetState() {
  newName.value = ''
  newSurname.value = ''
  newNick.value = ''
}

function setData() {
  if (user.value != null) {
    newName.value = user.value.name.toString()
    newSurname.value = user.value.surname.toString()
    newNick.value = user.value.nick.toString()
    uid.value = user.value.reference?.id
    console.log(user.value)
    console.log(newName.value)
  }
}

watch(isShow, (newVal) => {
  isShowRef.value = newVal;
  if (newVal) {
    setData();
  }
});
</script>

<style>

</style>
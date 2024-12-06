<template>
  <v-dialog :model-value="isShow" max-width="1000" @update:model-value="close" >
    <v-card>
      <v-card-title class="align-center justify-center d-flex px-5 py-5">
        <span class="text-h5">{{ $t('user.createLeagueDialog.createLeague')}}</span>
      </v-card-title>

        <v-card-text>
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-text-field
              v-model="leagueName"
              :label="$t('user.createLeagueDialog.leagueName')"
              :rules="[requiredRule(), leagueNameLengthRule(), lengthRuleShort()]"
              required
            ></v-text-field>

            <v-text-field
              v-model="leagueDescription"
              :label="$t('user.createLeagueDialog.leagueDescription')"
              :rules="[requiredRule(), descriptionLengthRule(),lengthRuleShort() ]"
              required
            ></v-text-field>

            <v-select
              v-model="pickedLeague"
              :items="leagues"
              :label="$t('user.createLeagueDialog.leaguePicker')"
              item-title="text"
              item-value="value"
              :rules="[requiredRule()]"
              required
            ></v-select>

            <div class="d-flex flex-column align-center">
              <v-switch
                v-model="leagueIsPublic"
                :label="leagueIsPublic ? $t('user.createLeagueDialog.publicLeague') : $t('user.createLeagueDialog.privateLeague')"
                class="my-4"
              ></v-switch>

              <v-card-subtitle class="text-wrap text-center">
                {{ leagueIsPublic ? $t('user.createLeagueDialog.publicLeagueDescription') : $t('user.createLeagueDialog.privateLeagueDescription') }}
              </v-card-subtitle>
            </div>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" @click="close">{{ $t('user.profileDialogs.cancel')}}</v-btn>
          <v-btn color="primary" @click="createLeague">{{ $t('user.save') }}</v-btn>
        </v-card-actions>
        <v-alert class="mx-2 my-2" type="info" v-if="mess?.length"> {{ $t(`errors.betLeaguesSites.${mess}`) }}</v-alert>
      </v-card>
      
  </v-dialog>
</template>

<script lang="ts" setup>
import formValidation from '~/composables/formValidation'
import { requiredRule, lengthRuleShort, leagueNameLengthRule, descriptionLengthRule } from '~/composables/rules'
import type { ILeague } from '~/models/betLeague';
import { useBetLeagueStore } from '~/stores/betLeaguesStore'
import { useAuthStore } from '~/stores/authStore';
import { Timestamp } from 'firebase/firestore';

const { form, valid, isValid } = formValidation()
const leagueName = ref('')
const leagueDescription = ref('')
const leagueIsPublic = ref(false)
const pickedLeague = ref('')

const props = defineProps<{
  isShow: boolean
}>()

function close() {
  // resetState()
  emit('onClose')
}

const emit = defineEmits<{
  (e: 'onClose'): void,
  (e: 'onSave'): void
}>()

const { isShow } = toRefs(props)
const betLeagueStore = useBetLeagueStore()
const authStore = useAuthStore()
const { loggedUserData } = storeToRefs(authStore)
const { mess } = storeToRefs(betLeagueStore)

async function createLeague() {
  const generatedCode = await betLeagueStore.generateUniqueLeagueCode()
  if(generatedCode == undefined) return
  const newLeague = {
    leagueCode: generatedCode,
    name: leagueName.value,
    description: leagueDescription.value,
    league: pickedLeague.value,
    owner: loggedUserData.value?.reference,
    created: Timestamp.now().seconds,
    isPublic: leagueIsPublic.value,
    players: [loggedUserData.value?.reference]
  }
  console.log(newLeague)
  if (await isValid()) {
    try {
      await betLeagueStore.createLeague(newLeague)
      emit('onClose')
      emit('onSave')
    } catch (e) {
      console.log(e)
    }
  }
}



const leagues = [
  { text: 'Premier League', value: 'eng' },
  { text: 'Ekstraklasa', value: 'pol' },
  { text: 'Champions League', value: 'ucl' }
];
</script>

<style>

</style>
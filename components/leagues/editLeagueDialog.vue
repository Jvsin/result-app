<template>
  <v-dialog :model-value="isShowRef" max-width="700" scrollable @update:model-value="close" >
    <v-card>
      <v-card-title class="align-center justify-center d-flex px-5 py-5">
        {{ $t('user.betLeaguesSites.manageLeague') }}
      </v-card-title>
      <v-form ref="form" v-model="valid" class="px-5" @submit.prevent="editLeague">
        <v-text-field :label="$t('user.betLeaguesSites.editDialog.leagueName')" v-model="leagueName" variant="outlined" :rules="[requiredRule(), lengthRuleShort(), leagueNameLengthRule()]"></v-text-field>
        <v-text-field :label="$t('user.betLeaguesSites.editDialog.description')" v-model="description" variant="outlined" :rules="[requiredRule(), descriptionLengthRule()]"></v-text-field>
      </v-form>
      <v-card-text class="text-center mb-0 pb-0">
        <div class="mb-2">
          {{ $t('user.betLeaguesSites.editDialog.codeLeague') }}
        </div>
        <v-card-subtitle color="grey" text-color="white" class="font-weight-bold">
          <div class="inv-text">{{ invitationCode }}</div>
          <v-btn color="secondary" variant="plain" :prepend-icon="prependIcon" @click="copyToClipboard">{{ copyBtnText }}</v-btn>
        </v-card-subtitle>
      </v-card-text>

      <v-card-actions>
        <v-btn color="error" @click="close">{{ $t('user.betLeaguesSites.editDialog.cancel') }}</v-btn>
        <v-btn color="primary" @click="editLeague">{{$t('user.betLeaguesSites.editDialog.save')}}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import type { LeagueModel } from '~/models/betLeague';
import formValidation from '~/composables/formValidation'
import { lengthRuleShort, leagueNameLengthRule, descriptionLengthRule, requiredRule } from '~/composables/rules'
import { useI18n } from 'vue-i18n'
import { useBetLeagueStore } from '~/stores/betLeaguesStore';

const { form, valid, isValid } = formValidation()
const { t } = useI18n()

const props = defineProps<{
  league: LeagueModel,
  isShow: boolean
}>()

const emit = defineEmits<{
  (e: 'onClose'): void
}>()

function close() {
  emit('onClose')
  copyBtnText.value = t('user.betLeaguesSites.editDialog.copy')
  prependIcon.value = 'mdi-content-copy'
  resetState()
}

const { league, isShow } = toRefs(props)
const isShowRef = ref<boolean>()
const betLeagueStore = useBetLeagueStore()

const description = ref('')
const leagueName = ref('')

const invitationCode = ref('')
const copyBtnText = ref(t('user.betLeaguesSites.editDialog.copy'))
const prependIcon = ref('mdi-content-copy')

async function copyToClipboard() {
  await navigator.clipboard.writeText(invitationCode.value);
  copyBtnText.value = t('user.betLeaguesSites.editDialog.copied')
  prependIcon.value = 'mdi-check-circle-outline'
}

async function editLeague() {
  const leagueData = {
    description: description.value,
    name: leagueName.value
  }
  console.log(leagueData)
  if (await isValid()) {
    await betLeagueStore.editLeagueData(leagueData, invitationCode.value)
  }
}

function resetState() {

}

function setData() {
  if (league.value != null) {
    leagueName.value = league.value.name
    description.value = league.value.description
    invitationCode.value = league.value.leagueCode
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
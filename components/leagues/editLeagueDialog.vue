<template>
  <v-dialog :model-value="isShowRef" max-width="700" scrollable @update:model-value="close" >
    <v-card>
      <v-card-title class="align-center justify-center d-flex px-5 py-5">
        {{ $t('user.betLeaguesSites.manageLeague') }}
      </v-card-title>
       <v-tabs v-model="tab" align-tabs="center" fixed-tabs color="primary" class="full-width-tabs d-flex">
        <v-tab :key="0" value="0" class="equal-width-tab">Ogólne</v-tab>
        <v-tab :key="1" value="1" class="equal-width-tab">Zaproś</v-tab>
        <v-tab :key="2" value="2" class="equal-width-tab">Gracze</v-tab>
      </v-tabs>

      <v-tabs-window v-model="tab">
        <v-tabs-window-item :value="0">
          <v-form ref="form" v-model="valid" class="px-5 my-5" @submit.prevent="editLeague">
            <v-text-field :label="$t('user.betLeaguesSites.editDialog.leagueName')" v-model="leagueName" variant="outlined" :rules="[requiredRule(), lengthRuleShort(), leagueNameLengthRule()]"></v-text-field>
            <v-text-field :label="$t('user.betLeaguesSites.editDialog.description')" v-model="description" variant="outlined" :rules="[requiredRule(), descriptionLengthRule()]"></v-text-field>
          </v-form>

          <v-card-actions>
            <v-btn color="error" @click="close">{{ $t('user.betLeaguesSites.editDialog.cancel') }}</v-btn>
            <v-btn color="primary" @click="editLeague">{{$t('user.betLeaguesSites.editDialog.save')}}</v-btn>
          </v-card-actions>    
        </v-tabs-window-item>

        <v-tabs-window-item :value="1">
          <v-card-text class="text-center mb-0 py-5">
              <div class="mb-2">
                {{ $t('user.betLeaguesSites.editDialog.codeLeague') }}
              </div>
              <v-card-subtitle color="grey" text-color="white" class="font-weight-bold">
                <div class="inv-text">{{ invitationCode }}</div>
                <v-btn color="secondary" variant="plain" :prepend-icon="prependIcon" @click="copyToClipboard">{{ copyBtnText }}</v-btn>
              </v-card-subtitle>
            </v-card-text>
        </v-tabs-window-item>

        <v-tabs-window-item :value="2">
          <v-card class="py-2" v-for="(player,index) in players" :key="index">
            <v-row>
              <v-col cols="8">
                <v-card-title>
                  {{ player.nick }}
                </v-card-title>
              </v-col>
              <v-col cols="4" class="d-flex align-center justify-end">
                <v-btn v-if="confirmDeleteFlag !== index" variant="plain" color="error" @click="confirmDeleteFlag = index">
                  <v-icon >mdi-account-cancel-outline</v-icon>
                </v-btn>
                <div v-else>
                  <v-row class="mx-1">
                    <v-btn color="grey" variant="plain" @click="confirmDeleteFlag = -1">
                      <v-icon >mdi-cancel</v-icon>
                    </v-btn>
                    <v-btn color="error" variant="plain" @click="deletePlayer(index)">
                      <v-icon >mdi-check-bold</v-icon>
                    </v-btn> 
                  </v-row>
                </div>
              </v-col>
            </v-row>
          </v-card>
        </v-tabs-window-item>

      </v-tabs-window>
      <v-card-actions>
        <v-btn color="secondary" @click="close">Zamknij</v-btn>
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
const tab = ref(0)
const confirmDeleteFlag = ref(-1)

const props = defineProps<{
  players: any,
  league: LeagueModel,
  isShow: boolean
}>()

const emit = defineEmits<{
  (e: 'onClose'): void
}>()

function close() {
  emit('onClose')
  confirmDeleteFlag.value = -1
  copyBtnText.value = t('user.betLeaguesSites.editDialog.copy')
  prependIcon.value = 'mdi-content-copy'
  resetState()
}

const { players, league, isShow } = toRefs(props)

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

function deletePlayer(index: number) {
  console.log(players.value[index])
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
.full-width-tabs {
  width: 100%;
}

.equal-width-tab {
  flex: 1 1 0;
  text-align: center;
}
</style>
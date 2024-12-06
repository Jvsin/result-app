<template>
  <v-dialog :model-value="isShowRef" max-width="700" scrollable @update:model-value="close" >
    <v-card>
      <v-card-title class="align-center justify-center d-flex px-5 py-5">
        {{ $t('user.betLeaguesSites.manageLeague') }}
      </v-card-title>
       <v-tabs v-model="tab" align-tabs="center" fixed-tabs color="primary" class="full-width-tabs d-flex">
        <v-tab :key="0" value="0" class="equal-width-tab">{{ $t('user.betLeaguesSites.editDialog.mainTab') }}</v-tab>
        <v-tab :key="1" value="1" class="equal-width-tab">{{ $t('user.betLeaguesSites.editDialog.inviteTab') }}</v-tab>
        <v-tab :key="2" value="2" class="equal-width-tab">{{ $t('user.betLeaguesSites.editDialog.playersTab') }}</v-tab>
      </v-tabs>

      <v-tabs-window v-model="tab">
        <v-tabs-window-item :value="0">
          <v-form ref="form" v-model="valid" class="px-5 my-5" @submit.prevent="editLeague">
            <v-text-field readonly disabled :label="$t('user.betLeaguesSites.editDialog.leagueToBet')" v-model="leagueToBet" variant="outlined"></v-text-field>
            <v-text-field readonly disabled :label="$t('user.betLeaguesSites.editDialog.privacy')" v-model="isPublicText" variant="outlined"></v-text-field>
            <v-text-field :label="$t('user.betLeaguesSites.editDialog.leagueName')" v-model="leagueName" variant="outlined" :rules="[requiredRule(), lengthRuleShort(), leagueNameLengthRule()]"></v-text-field>
            <v-text-field :label="$t('user.betLeaguesSites.editDialog.description')" v-model="description" variant="outlined" :rules="[requiredRule(), descriptionLengthRule()]"></v-text-field>
            <v-row justify="center">
              <v-col>
                <div v-if="!confirmDeleteLeague" class="d-flex justify-center align-center">
                  <v-btn  color="error" variant="outlined"
                  @click="confirmDeleteLeague = true">{{$t('user.betLeaguesSites.editDialog.deleteLeague')}}</v-btn>
                </div>
                <div v-else class="d-flex justify-center align-center">
                  <v-card-subtitle>
                    {{$t('user.betLeaguesSites.editDialog.confirmDelete')}}
                  </v-card-subtitle>
                  <v-btn color="secondary" class="mx-1" variant="flat"
                    @click="confirmDeleteLeague = false">{{$t('user.betLeaguesSites.editDialog.cancel')}}</v-btn>
                  <v-btn color="error" class="mx-1" variant="outlined"
                    @click="deleteLeague">{{$t('user.betLeaguesSites.editDialog.deleteLeague')}}</v-btn>
                </div>
              </v-col>
            </v-row>
          </v-form>

          <v-card-actions>
            <v-btn color="error" @click="close">{{ $t('user.betLeaguesSites.editDialog.cancel') }}</v-btn>
            <v-btn color="primary" @click="editLeague">{{$t('user.betLeaguesSites.editDialog.save')}}</v-btn>
          </v-card-actions>    
        </v-tabs-window-item>

        <v-tabs-window-item :value="1">
          <v-card-text v-if="isPublic" class="text-center mb-0 py-5">
              <div class="mb-2 text-h6">
                {{ $t('user.betLeaguesSites.editDialog.codeLeague') }}
              </div>
              <v-card-subtitle color="grey" text-color="white" class="font-weight-bold">
                <div class="inv-text text-h6">{{ invitationCode }}</div>
                <v-btn color="secondary" variant="plain" :prepend-icon="prependIcon" @click="copyToClipboard">{{ copyBtnText }}</v-btn>
              </v-card-subtitle>
            </v-card-text>
            <v-card-text v-else>
              <v-card-title class="text-center">
                {{ $t('user.betLeaguesSites.editDialog.typeUserCode') }}
              </v-card-title>
              <v-row class="py-2 px-2">
                <v-text-field class="align-center"
                  v-model="searchUser"
                  :label="$t('user.betLeaguesSites.editDialog.searchPlayer')"
                  variant="outlined"
                  clearable
                  :rules="[codeLengthRule()]"
                ></v-text-field>
                <v-btn color="primary" class="d-flex ml-2 align-center justify-center"
                 variant="plain" icon="mdi-account-search"
                 @click="searchPlayer"></v-btn>
              </v-row>
              <v-card class="py-2" v-for="user in foundUsers">
                <v-row>
                  <v-col cols="4" class="d-flex justify-center align-center">
                    {{ user.nick }}
                  </v-col>
                  <v-col cols="6" class="d-flex justify-center align-center">
                    <v-card-subtitle>
                      {{ user.name + ' ' + user.surname }}
                    </v-card-subtitle>
                  </v-col>
                  <v-col cols="2" class="d-flex justify-center align-center">
                    <v-btn variant="plain" color="primary" @click="sendInvite(user.reference)"> <v-icon >mdi-account-plus-outline</v-icon></v-btn>
                  </v-col>
                </v-row>
              </v-card>
              <v-alert closable elevation="13" v-if="alertMess.length" type="info">
                {{ $t(`errors.betLeaguesSites.${alertMess}`) }}</v-alert>
            </v-card-text>
        </v-tabs-window-item>

        <v-tabs-window-item :value="2">
          <v-container class="scrollable-container">
            <v-card  class="py-2" v-for="(player,index) in players" :key="index">
              <v-row>
                <v-col cols="8">
                  <v-card-title>
                    {{ player.nick }}
                  </v-card-title>
                </v-col>
                <v-col v-if="player.nick != loggedUserData?.nick" cols="4" class="d-flex align-center justify-end">
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
            <v-alert v-if="alertMess.length" type="info">{{ $t(`errors.betLeaguesSites.userDeleted`) }}</v-alert>
          </v-container>
        </v-tabs-window-item>

      </v-tabs-window>
      <v-card-actions>
        <v-btn color="secondary" @click="close">{{ $t('leaguesPage.close')}}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import type { LeagueModel } from '~/models/betLeague';
import formValidation from '~/composables/formValidation'
import { lengthRuleShort, leagueNameLengthRule, descriptionLengthRule, requiredRule, codeLengthRule } from '~/composables/rules'
import { useI18n } from 'vue-i18n'
import { useBetLeagueStore } from '~/stores/betLeaguesStore'
import { useAuthStore } from '~/stores/authStore';
import { useInvitationStore } from '~/stores/invitationStore';
import type { UserModel } from '~/models/user';
import type { IInvitation } from '~/models/invitation'
import { Timestamp } from 'firebase/firestore';
import { routerKey } from 'vue-router';

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
  betLeagueStore.mess = ''
  resetState()
}

const { players, league, isShow } = toRefs(props)

const isShowRef = ref<boolean>()
const betLeagueStore = useBetLeagueStore()
const invitationStore = useInvitationStore()

const description = ref('')
const leagueName = ref('')
const isPublic = ref(false)
const leagueCode = ref('')
const leagueToBet = ref('')
const isPublicText = ref('')

const invitationCode = ref('')
const copyBtnText = ref(t('user.betLeaguesSites.editDialog.copy'))
const prependIcon = ref('mdi-content-copy')

async function copyToClipboard() {
  await navigator.clipboard.writeText(invitationCode.value);
  copyBtnText.value = t('user.betLeaguesSites.editDialog.copied')
  prependIcon.value = 'mdi-check-circle-outline'
}

const authStore = useAuthStore()
const { loggedUserData } = storeToRefs(authStore)
const searchUser = ref('')
const foundUsers = ref<UserModel[]>()
const alertMess = computed(() => invitationStore.alertMess)

async function searchPlayer() {
  await authStore.fetchUserByCode(searchUser.value).then(users => { 
    if (players.value.find((p: any) => p.nick === users[0].nick)) {
      invitationStore.alertMess = 'userAlreadyInLeague'
      foundUsers.value = undefined
    }
    else foundUsers.value = users 
  })
}

async function editLeague() {
  const leagueData = {
    description: description.value,
    name: leagueName.value
  }
  console.log(leagueData)
  if (await isValid()) {
    await betLeagueStore.editLeagueData(leagueData, league.value?.reference.id)
    close()
  }
}

const confirmDeleteLeague = ref(false)
const router = useRouter()

async function deleteLeague() {
  try {
    console.log(league.value?.reference)
    await betLeagueStore.deleteLeague(league.value?.reference)
    router.push('/user')
  } catch (e) {
    console.log(e)
  }
}

async function deletePlayer(index: number) {
  try {
    const userRef = players.value[index].playerRef
    console.log(userRef)
    await betLeagueStore.deletePlayerFromLeague(userRef, league.value).then(players.value.splice(index, 1))

  } catch (e) {
    console.error(e)
  }
}

function resetState() {

}

function setLeagueName(league: string) {
  switch (league) {
    case "pol":
      return "Ekstraklasa"
    case "eng":
      return "Premier League"
    case "ucl":
      return "Champions League"
  }
  return ''
}

function setData() {
  if (league.value != null) {
    leagueName.value = league.value.name
    description.value = league.value.description
    invitationCode.value = league.value.leagueCode
    isPublic.value = league.value.isPublic
    leagueCode.value = league.value.leagueCode
    leagueToBet.value = setLeagueName(league.value.league)
  }
  isPublicText.value = isPublic.value ? t('user.betLeaguesSites.editDialog.truePublic') : t('user.betLeaguesSites.editDialog.falsePublic')
  console.log(isPublic.value)
}

async function sendInvite(inviteUserRef: any) {
  try {
    if (inviteUserRef) {
      const newInvite: IInvitation = {
        leagueReference: league.value.reference,
        leagueCode: league.value.leagueCode,
        user: inviteUserRef,
        creationDate: Timestamp.now(),
        isAccepted: false,
        ownerNick: authStore.loggedUserData?.nick as string  // do poprawy pewnie w przyszłości
      }
      await invitationStore.sendInviteToUser(newInvite)
    }
  } catch (e) {
    console.log(e)
  }
}

watch(isShow, (newVal:boolean) => {
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
.scrollable-container {
  max-height: 75vh;
  overflow-y: auto;
}
</style>
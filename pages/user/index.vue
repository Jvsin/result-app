<template>
  <v-layout class="rounded rounded-md">
    <v-main class="d-flex align-center justify-center" style="height: 100vh; overflow: hidden;">
      <v-img src="/user_main.jpg" cover gradient="to bottom, rgba(0,0,0,.25), rgba(0,0,0,.7)"
        class="text-center w-100 h-100">
        <v-sheet class="d-flex justify-center flex-wrap text-center mx-auto my-10 px-4" elevation="4"
          style="background-color: rgba(0, 0, 0, 0.5); height: 90%; width: 90%;" rounded>
          <v-row class="d-flex align-center flex-wrap" style="height: 150px;">
            <v-col cols="12" sm="4" md="6" class="d-flex justify-center justify-sm-start align-center mb-2 mb-sm-0">
              <span class="text-h4 text-center text-sm-left px-5">{{ $t('user.welcome') + userData?.nick + '!' }}</span>
            </v-col>
            
            <v-col cols="12" sm="8" md="6" class="d-flex justify-center justify-sm-end justify-md-end align-center">
              <v-tabs v-model="tab" align-tabs="start" color="primary" class="px-5">
                <v-tab :key="0" value="0">{{ $t("user.profile") }}</v-tab>
                <v-tab :key="1" value="1">{{ $t("user.betMatchesView") }}</v-tab>
                <v-tab :key="2" value="2">{{ $t("user.leaguesView") }}</v-tab>
              </v-tabs>
            </v-col>
          </v-row>
          <v-container style="height: calc(100% - 150px); overflow-y: auto;">
            <v-tabs-window v-model="tab">
              <v-tabs-window-item :value="0">
                <v-container>

                  <v-row>
                    <v-col cols="12" md="6">
                      <v-card class="justify-center align-center flex-column" variant="flat" color="rgba(0, 0, 0, 0)">
                        <v-avatar color="secondary" size="80">{{ nameAndSurname.charAt(0).toUpperCase() }}</v-avatar>
                        <div class="text-h2 py-3">
                          {{ userData?.nick }}
                        </div>
                        
                         <v-card-subtitle color="grey" text-color="white" class="font-weight-bold">
                          <div class="inv-text text-h6">{{ uniqueCode }}</div>
                          <v-btn color="secondary" variant="plain" :prepend-icon="prependIcon" @click="copyToClipboard">{{ copyBtnText }}</v-btn>
                        </v-card-subtitle>
                        <v-text-field v-model="nameAndSurname" :label="$t('user.nameAndSurname')" readonly
                          variant="plain"></v-text-field>
                        <v-text-field v-model="email" label="Email" readonly variant="plain"></v-text-field>
                        <v-text-field v-model="established" :label="$t('user.established')" readonly variant="plain"></v-text-field>

                        <v-row justify="center" class="py-2">
                          <div class="px-2 py-2">
                            <v-btn variant="outlined" color="secondary" @click="changeProfileDialogFlag()">
                              {{ $t('user.editProfile') }}
                            </v-btn>
                          </div>
                          <div class="px-2 py-2">
                            <v-btn variant="outlined" color="primary" @click="changeAddLeaguesFlag()">
                              {{ $t('user.followLeagues')}}
                            </v-btn>
                          </div>
                          <!-- <div>
                            <v-btn @click="router.push('/user/test')">Run Firebase Function</v-btn>
                          </div> -->
                        </v-row>
                      </v-card>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-card-actions class="justify-center">
                        <v-col>
                          <div class="py-5">
                            <v-card-subtitle class="py-2 mb-2">{{ $t('user.pointsGained').toUpperCase() }}</v-card-subtitle>
                            <v-row justify="center">
                              <v-col cols="auto" class="d-flex flex-column align-center justify-center">
                                <div>
                                  <v-avatar color="white" image="/public/pl.png" size="60"></v-avatar>
                                  <div class="text-h5 mt-2">{{ userData?.engPoints }}</div>
                                </div>
                              </v-col>
                              <v-col cols="auto" class="d-flex flex-column align-center justify-center">
                                <div>
                                  <v-avatar image="/public/ekstraklasa.png" size="60"></v-avatar>
                                  <div class="text-h5 mt-2">{{ userData?.polPoints }}
                                  </div>
                                </div>
                              </v-col>
                              <v-col cols="auto" class="d-flex flex-column align-center justify-center">
                                <div>
                                  <v-avatar color="white" image="/public/ucl.png" size="60"></v-avatar>
                                  <div class="text-h5 mt-2">{{ userData?.uclPoints }}</div>
                                </div>
                              </v-col>
                            </v-row>
                            <div class="py-5">
                              <v-card-subtitle class="py-2">{{ $t('user.bettingAccuracy').toUpperCase() }}</v-card-subtitle>
                              <v-progress-circular :rotate="360" :size="100" :width="15" :value="betAccuracy"
                                color="primary">
                                {{ userData?.betAcc + '%' }}
                              </v-progress-circular>
                            </div>
                          </div>
                          <v-row justify="center" class="pa-5">

                          </v-row>
                        </v-col>
                      </v-card-actions>
                    </v-col>
                  </v-row>
                  
                </v-container>
                <EditProfileDialog :user="userData" :is-show="showEditProfileFlag" @on-close="changeProfileDialogFlag"/>
                <AddLeaguesDialog :user="userData" :is-show="showAddLeaguesFlag" @on-close="changeAddLeaguesFlag"/>
              </v-tabs-window-item>

              <v-tabs-window-item :value="1">
                <v-container>
                  <v-row align="center">
                    <v-col cols="12" md="4">
                      <v-hover>
                        <template v-slot:default="{ isHovering, props }">
                          <v-card class="mx-auto" max-width="400" v-bind="props"
                            :color="isHovering ? 'grey' : undefined" @click="getBettingRoute('eng')">
                            <v-card-title>
                              PREMIER LEAGUE
                            </v-card-title>
                            <v-img class="align-end text-white" height="200" src="/public/pl.png"></v-img>
                            <v-card-actions>
                              <v-btn block border color="primary" @click="getBettingRoute('eng')">{{
                                $t('user.betButton')
                                }}</v-btn>
                            </v-card-actions>
                          </v-card>
                        </template>
                      </v-hover>
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-hover>
                        <template v-slot:default="{ isHovering, props }">
                          <v-card class="mx-auto" max-width="400" v-bind="props"
                            :color="isHovering ? 'grey' : undefined" @click="getBettingRoute('pol')">
                            <v-card-title>
                              EKSTRAKLASA
                            </v-card-title>
                            <v-img class="align-end text-white" height="200" src="/public/ekstraklasa.png"></v-img>
                            <v-card-actions>
                              <v-btn block border color="primary" @click="getBettingRoute('pol')">{{
                                $t('user.betButton')
                                }}</v-btn>
                            </v-card-actions>
                          </v-card>
                        </template>
                      </v-hover>
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-hover>
                        <template v-slot:default="{ isHovering, props }">
                          <v-card class="mx-auto" max-width="400" v-bind="props"
                            :color="isHovering ? 'grey' : undefined" @click="getBettingRoute('ucl')">
                            <v-card-title>
                              CHAMPIONS LEAGUE
                            </v-card-title>
                            <v-img class="align-end text-white" height="200" src="/public/ucl.png"></v-img>
                            <v-card-actions>
                              <v-btn block border color="primary" @click="getBettingRoute('ucl')">{{
                                $t('user.betButton')
                                }}</v-btn>
                            </v-card-actions>
                          </v-card>
                        </template>
                      </v-hover>
                    </v-col>
                  </v-row>
                </v-container>
              </v-tabs-window-item>

              <v-tabs-window-item :value="2">

                <v-container>
                  <div v-if="userBetLeagues.length" v-for="card in userBetLeagues">
                    <v-hover>
                      <template v-slot:default="{ isHovering, props }">
                        <v-card v-bind="props" :color="isHovering ? 'primary' : undefined" class="mb-3 py-2"
                          @click="getLeagueRoute(card.reference.id)">
                          <v-row class="d-flex flex-wrap" justify="center">
                            <v-col cols="12" sm="5" class="d-flex-column align-center align-sm-start justify-center">
                              <v-card-title>
                                {{ card.name }}
                              </v-card-title>
                            </v-col>
                            <v-col cols="12" sm="3"
                              class="d-flex flex-column align-center align-sm-start justify-center">
                              <v-card-subtitle>
                                {{ setLeaguesData(card.league) }}
                              </v-card-subtitle>
                            </v-col>
                            <v-col cols="12" sm="3"
                              class="d-flex flex-column align-center align-sm-start justify-center">
                              <v-card-subtitle>
                                {{$t('user.betLeaguesSites.players') +  card.players.length }}
                              </v-card-subtitle>
                            </v-col>
                            <v-col cols="12" sm="1"
                              class="d-flex flex-column align-sm-center align-center justify-center">
                              <v-icon v-if="card.isPublic">mdi-lock-open-variant</v-icon>
                              <v-icon v-else>mdi-lock</v-icon>
                            </v-col>
                          </v-row>
                        </v-card>
                      </template>
                    </v-hover>
                  </div>
                  <div v-else>
                    <v-card-title class="text-h4 text-center text-wrap">
                      {{ $t('user.noBetLeaguesTitle') }}
                    </v-card-title>
                    <v-card-text class="py-2">{{ $t('user.noBetLeaguesText') }}</v-card-text>
                  </div>
                  <v-card-actions>
                    <v-row justify="center" class="py-2">
                      <v-col cols="auto">
                        <v-btn variant="outlined" color="secondary" @click="changeFindLeagueFlag">{{ $t('user.joinPublicLeague') }}</v-btn>
                      </v-col>
                      <v-col cols="auto">
                        <v-btn variant="outlined" color="secondary" @click="changeInvitationsFlag">{{ $t('user.joinByInvitation')}}</v-btn>
                      </v-col>
                      <v-col cols="auto">
                        <v-btn variant="flat" color="primary" @click="changeCreateLeagueFlag">{{ $t('user.createOwnLeague') }}</v-btn>
                      </v-col>
                    </v-row>
                  </v-card-actions>
                  <createLeagueDialog :is-show="showCreateLeagueFlag" @on-save="fetchNewLeagues" @on-close="changeCreateLeagueFlag"></createLeagueDialog>
                  <FindPublicLeague :is-show="showFindLeagueFlag" @on-close="changeFindLeagueFlag"></FindPublicLeague>
                  <ManageInvitations :is-show="showInvitationsFlag" @on-close="changeInvitationsFlag"></ManageInvitations>
                </v-container>
              </v-tabs-window-item>

            </v-tabs-window>
          </v-container>
        </v-sheet>
      </v-img>
    </v-main>
  </v-layout>
</template>

<script lang="ts" setup>
import AddLeaguesDialog from '~/components/user/addLeaguesDialog.vue';
import EditProfileDialog from '~/components/user/editProfileDialog.vue';
import { useAuthStore } from '~/stores/authStore';
import { useBetLeagueStore } from '~/stores/betLeaguesStore'
import createLeagueDialog from '~/components/leagues/createLeagueDialog.vue'
import FindPublicLeague from '~/components/leagues/findPublicLeague.vue';
import ManageInvitations from '~/components/leagues/manageInvitations.vue';
import { useInvitationStore } from '~/stores/invitationStore';
import { useI18n } from 'vue-i18n'

definePageMeta({
  middleware: 'auth'
})

const tab = ref(0)
const router = useRouter()
const { t } = useI18n()

const authStore = useAuthStore()
const betLeagueStore = useBetLeagueStore()
const invitationStore = useInvitationStore()

const copyBtnText = ref(t('user.betLeaguesSites.editDialog.copy'))
const prependIcon = ref('mdi-content-copy')
const uniqueCode = ref()
async function copyToClipboard() {
  await navigator.clipboard.writeText(uniqueCode.value);
  copyBtnText.value = t('user.betLeaguesSites.editDialog.copied')
  prependIcon.value = 'mdi-check-circle-outline'
}

const userData = computed(() => authStore.loggedUserData)

const nameAndSurname = computed(() => {
  if (!userData.value) return ''
  return `${userData.value?.name} ${userData.value?.surname}`
})

const email = computed(() => {
  if (!userData.value) return ''
  return userData.value.email
})

const betAccuracy = computed(() => {
  if (!userData.value) return 0
  return userData.value.betAcc
})

const established = computed(() => {
  if(!userData.value) return 'data'
  return formatTimestampToDate(userData.value.established)
})

const userBetLeagues = computed(() => {
  return betLeagueStore.userBetLeagues
})

async function fetchNewLeagues() {
  if (userData.value != null) {
    await betLeagueStore.fetchUserBetLeagues(userData.value?.leagues)
  }
}

function getLeagueRoute(ref: string) {
  // console.log('Navigating to /user/' + value);
  // router.push(`/user/${value}`);
  router.push(`/user/${ref}`)
}

function getBettingRoute(league: string) {
  // console.log('Navigating to /user/' + value);
  // router.push(`/user/${value}`);
  router.push(`/user/bet-sites/${league}`)
}


const showEditProfileFlag = ref(false)
const showAddLeaguesFlag = ref(false)
const showCreateLeagueFlag = ref(false)
const showFindLeagueFlag = ref(false)
const showInvitationsFlag = ref(false)

function changeProfileDialogFlag() {
  showEditProfileFlag.value = !showEditProfileFlag.value
}

function changeAddLeaguesFlag( ) {
  showAddLeaguesFlag.value = !showAddLeaguesFlag.value
}

function changeCreateLeagueFlag() {
  showCreateLeagueFlag.value = !showCreateLeagueFlag.value
}

function changeFindLeagueFlag() {
  showFindLeagueFlag.value = !showFindLeagueFlag.value
}

function changeInvitationsFlag() {
  showInvitationsFlag.value = !showInvitationsFlag.value
}

function setLeaguesData(league: string) {
  switch (league) {
    case "eng":
      return "Premier League"
    case "pol":
      return "Ekstraklasa"
    case "ucl":
      return "Champions League"
  }
}

function formatTimestampToDate(timestamp: any) {
  if (timestamp != undefined) {
    const { seconds, nanoseconds } = timestamp;

    const milliseconds = (seconds * 1000) + Math.floor(nanoseconds / 1000000);

    const date = new Date(milliseconds);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}.${month}.${year}`;
  }
  else {
    return 'data zalozenia'
  }
}

onMounted(async () => {
  await authStore.actualizeUserData()
  if (userData.value && userData.value.leagues.length != userBetLeagues.value.length) {
    await betLeagueStore.fetchUserBetLeagues(userData.value.leagues)
  }
  if(userData.value?.reference){
    await invitationStore.fetchAllUserInvitations(userData.value?.reference)
  }
  if (userData.value) {
    uniqueCode.value = userData.value.userCode
  }
})
</script>

<style scoped>
.v-main {
  height: 100vh;
  overflow: hidden;
}

.v-container {
  height: calc(100% - 150px);
  overflow-y: auto;
}
</style>
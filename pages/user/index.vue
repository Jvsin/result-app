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
                      <v-card variant="flat" color="rgba(0, 0, 0, 0)">
                        <v-avatar color="secondary" size="80">{{ nameAndSurname.charAt(0).toUpperCase() }}</v-avatar>
                        <div class="text-h2 py-3">
                          {{ userData?.nick }}
                        </div>
                        
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
                  <div v-for="card in leagues">
                    <v-hover>
                      <template v-slot:default="{ isHovering, props }">
                        <v-card v-bind="props" :color="isHovering ? 'primary' : undefined" class="mb-3"
                          @click="getLeagueRoute()">
                          <v-row class="d-flex flex-wrap" justify="center">
                            <v-col cols="12" sm="6" class="d-flex flex-column align-center justify-center">
                              <v-card-title>
                                {{ card.name }}
                              </v-card-title>
                            </v-col>
                            <v-col cols="12" sm="3"
                              class="d-flex flex-column align-center align-sm-start justify-center">
                              <v-card-subtitle>
                                {{ card.league }}
                              </v-card-subtitle>
                            </v-col>
                            <v-col cols="12" sm="3"
                              class="d-flex flex-column align-center align-sm-start justify-center">
                              <v-card-subtitle>
                                {{ 'Pozycja: ' + card.position + '/' + card.players }}
                              </v-card-subtitle>
                            </v-col>
                          </v-row>
                        </v-card>
                      </template>
                    </v-hover>
                  </div>

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
import type { Timestamp } from 'firebase/firestore';
import AddLeaguesDialog from '~/components/user/addLeaguesDialog.vue';
import EditProfileDialog from '~/components/user/editProfileDialog.vue';
import { useAuthStore } from '~/stores/authStore';


const tab = ref(0)

const leagues = [
  { name: "Moja liga testowa", position: 12, players: 24, league: "english-league", icon: "/public/pl.png" },
  { name: "Liga graczy", position: 2, players: 10, league: "polish-league", icon: "/public/ekstraklasa.png" },
]

const router = useRouter();

const authStore = useAuthStore()
// const userData = authStore.loggedUserData
// const betAccuracy = computed(() => userData?.betAcc)

// const nameAndSurname = computed(() => userData?.name + ' ' + userData?.surname)
// const email = computed(() => userData?.email)
// const established = computed(() => formatTimestampToDate(userData?.established))
const userData = computed(() => authStore.loggedUserData)
watch(userData, (olddata, newdata) => {
  console.log(userData.value?.favLeagues)
})
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

function getLeagueRoute() {
  // console.log('Navigating to /user/' + value);
  // router.push(`/user/${value}`);
  router.push('/user/table')
}

function getBettingRoute(league: string) {
  // console.log('Navigating to /user/' + value);
  // router.push(`/user/${value}`);
  router.push(`/user/bet-sites/${league}`)
}


const showEditProfileFlag = ref(false)
const showAddLeaguesFlag = ref(false)

function changeProfileDialogFlag() {
  showEditProfileFlag.value = !showEditProfileFlag.value
}

function changeAddLeaguesFlag( ) {
  showAddLeaguesFlag.value = !showAddLeaguesFlag.value
}

async function handleLogout() {
  try {
    await authStore.logout()
    router.push('/')
  }
  catch (err: any) {
    console.log(err)
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
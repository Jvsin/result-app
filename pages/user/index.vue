<template>
  <v-layout class="rounded rounded-md">
    <v-main class="d-flex align-center justify-center" style="height: 100vh; overflow: hidden;">
      <v-img src="/user_main.jpg" cover gradient="to bottom, rgba(0,0,0,.25), rgba(0,0,0,.7)"
        class="text-center w-100 h-100">
        <v-sheet class="d-flex justify-center flex-wrap text-center mx-auto my-10 px-4" elevation="4"
          style="background-color: rgba(0, 0, 0, 0.5); height: 90%; width: 90%;" rounded>
          <v-row class="d-flex align-center flex-wrap" style="height: 150px;">
            <v-col cols="12" sm="4" md="6" class="d-flex justify-center justify-sm-start align-center mb-2 mb-sm-0">
              <span class="text-h4 text-center text-sm-left px-5">{{ $t('user.welcome') + "Jasin!" }}</span>
            </v-col>
            <v-col cols="12" sm="8" md="6" class="d-flex justify-center justify-sm-end justify-md-end align-center">
              <v-tabs v-model="tab" align-tabs="start" color="primary" class="px-5">
                <v-tab :key="0" value="0">{{ $t("user.betMatchesView") }}</v-tab>
                <v-tab :key="1" value="1">{{ $t("user.leaguesView") }}</v-tab>
                <v-tab :key="2" value="2">{{ $t("user.profile") }}</v-tab>
              </v-tabs>
            </v-col>
          </v-row>
          <v-container style="height: calc(100% - 150px); overflow-y: auto;">
            <v-tabs-window v-model="tab">
              <v-tabs-window-item :value="0">
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
                              <v-btn block border color="primary" @click="getBettingRoute('eng')">{{ $t('user.betButton')
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
                              <v-btn block border color="primary" @click="getBettingRoute('pol')">{{ $t('user.betButton')
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
                              <v-btn block border color="primary" @click="getBettingRoute('ucl')">{{ $t('user.betButton')
                                }}</v-btn>
                            </v-card-actions>
                          </v-card>
                        </template>
                      </v-hover>
                    </v-col>
                  </v-row>
                </v-container>
              </v-tabs-window-item>

              <v-tabs-window-item :value="1">

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

              <v-tabs-window-item :value="2">
                <v-container>

                  <v-avatar color="grey" size="80">J</v-avatar>

                  <v-card-title>
                    <div class="text-h2">Jasin</div>
                    <span class="text-h5">Piotr Jasiński</span>
                  </v-card-title>

                  <v-card-subtitle>
                    p.jasina16@gmail.com
                  </v-card-subtitle>

                  <div class="py-5">
                    <v-row justify="center">
                      <v-col cols="auto" class="d-flex flex-column align-center justify-center">
                        <div>
                          <v-avatar color="white" image="/public/pl.png"></v-avatar>
                          <div class="mt-2">8</div>
                        </div>
                      </v-col>
                      <v-col cols="auto" class="d-flex flex-column align-center justify-center">
                        <div>
                          <v-avatar image="/public/ekstraklasa.png"></v-avatar>
                          <div class="mt-2">23</div>
                        </div>
                      </v-col>
                      <v-col cols="auto" class="d-flex flex-column align-center justify-center">
                        <div>
                          <v-avatar color="white" image="/public/ucl.png"></v-avatar>
                          <div class="mt-2">10</div>
                        </div>
                      </v-col>
                    </v-row>
                  </div>

                  <v-card-actions class="justify-center">
                    <v-btn variant="elevated" color="secondary">
                      {{ $t('user.editProfile') }}
                    </v-btn>
                  </v-card-actions>
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

const tab = ref(0)

const leagues = [
  { name: "Moja liga testowa", position: 12, players: 24, league: "english-league", icon: "/public/pl.png" },
  { name: "Liga graczy", position: 2, players: 10, league: "polish-league", icon: "/public/ekstraklasa.png" },
]

const router = useRouter();

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
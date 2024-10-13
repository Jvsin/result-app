<template>
  <v-layout class="rounded rounded-md">
    <v-main class="d-flex align-center justify-center" style="height: 100vh;">
      <v-img src="/user_main.jpg" cover gradient="to bottom, rgba(0,0,0,.25), rgba(0,0,0,.7)"
        class="text-center w-100 h-100">

        <v-sheet class="d-flex justify-center flex-wrap text-center mx-auto my-10 px-4" elevation="4"
          style="background-color: rgba(0, 0, 0, 0.5); height: 90%; width: 90%;" rounded>
          <v-row class="d-flex align-center flex-wrap" style="height: 150px;">
            <v-col cols="12" sm="4" md="6" class="d-flex justify-center justify-sm-start  align-center mb-2 mb-sm-0">
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

          <v-container>
            <v-tabs-window v-model="tab">
              <v-tabs-window-item :value="1">
                <v-row>
                  <v-col cols="4">
                    <v-hover>
                      <template v-slot:default="{ isHovering, props }">
                        <v-card class="mx-auto" max-width="400" v-bind="props" :color="isHovering ? 'grey' : undefined">
                          <v-card-title>
                            PREMIER LEAGUE
                          </v-card-title>
                          <v-img class="align-end text-white" height="200" src="/public/pl.png"></v-img>

                          <v-card-actions>
                            <v-btn block border color="primary">Typuj</v-btn>

                          </v-card-actions>
                        </v-card>
                      </template>
                    </v-hover>
                  </v-col>
                  <v-col cols="4">
                    <v-hover>
                      <template v-slot:default="{ isHovering, props }">
                        <v-card class="mx-auto" max-width="400" v-bind="props" :color="isHovering ? 'grey' : undefined">
                          <v-card-title>
                            EKSTRAKLASA
                          </v-card-title>
                          <v-img class="align-end text-white" height="200" src="/public/ekstraklasa.png"></v-img>

                          <v-card-actions>
                            <v-btn block border color="primary">Typuj</v-btn>

                          </v-card-actions>
                        </v-card>
                      </template>
                    </v-hover>
                  </v-col>
                  <v-col cols="4">
                    <v-hover>
                      <template v-slot:default="{ isHovering, props }">
                        <v-card class="mx-auto" max-width="400" v-bind="props" :color="isHovering ? 'grey' : undefined">
                          <v-card-title>
                            CHAMPIONS LEAGUE
                          </v-card-title>
                          <v-img class="align-end text-white" height="200" src="/public/ucl.png"></v-img>

                          <v-card-actions>
                            <v-btn block border color="primary">Typuj</v-btn>

                          </v-card-actions>
                        </v-card>
                      </template>
                    </v-hover>
                  </v-col>
                </v-row>
              </v-tabs-window-item>
              <v-tabs-window-item :value="2">
                <v-container>
                  ligi
                </v-container>
              </v-tabs-window-item>
              <v-tabs-window-item :value="3">profil</v-tabs-window-item>

            </v-tabs-window>
          </v-container>

        </v-sheet>
      </v-img>
    </v-main>
  </v-layout>
</template>

<script lang="ts" setup>

const tab = ref(0)

</script>

<style>

</style>
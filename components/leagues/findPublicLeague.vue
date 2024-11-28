<template>
   <v-dialog :model-value="isShow" max-width="600" @update:model-value="close" >
    <v-card>
      <v-card-title class="align-center justify-center d-flex px-5 py-5">
        {{ $t('user.betLeaguesSites.findPublicLeague')}}
      </v-card-title>
      <v-card-text>
        <v-row class="py-2 px-2">
          <v-text-field class="align-center justify-center"
            v-model="leagueCode"
            :label="$t('user.betLeaguesSites.leagueCode')"
            required
            :rules="[codeLengthRule()]"
          ></v-text-field>
          <v-btn color="primary" class="d-flex ml-2 align-center justify-center"
            variant="plain" icon="mdi-text-search" @click="searchLeague"
          ></v-btn>
        </v-row>
        <v-card v-if="foundLeague" class="d-flex flex-column align-center text-center">
          <v-container>
            <v-row justify="center">
              <v-col cols="12">
                <v-card-title>
                  {{ foundLeague.name }}
                </v-card-title>
              </v-col>
              <v-col cols="12">
                <v-card-subtitle>
                  {{ foundLeague.description }}
                </v-card-subtitle>
              </v-col>
              <v-col cols="12">
                <v-card-subtitle>
                  {{ setLeaguesData(foundLeague.league) }}
                </v-card-subtitle>
              </v-col>
              <v-col cols="12">
                <v-card-subtitle>
                  {{ $t('user.betLeaguesSites.players') +  foundLeague.players.length }}
                </v-card-subtitle>
              </v-col>
              <v-col cols="12">
                <v-card-actions class="d-flex justify-center">
                  <v-btn variant="outlined" color="primary" prepend-icon="mdi-location-enter" @click="joinLeague">{{ $t('user.betLeaguesSites.join') }}</v-btn>
                  <v-btn variant="outlined" color="error" prepend-icon="mdi-cancel" @click="cancel">{{ $t('user.betLeaguesSites.cancel') }}</v-btn>
                </v-card-actions>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
        <v-alert closable elevation="13" v-if="errorMessage.length" type="error">
          {{ $t(`errors.betLeaguesSites.${errorMessage}`) }}</v-alert>
      </v-card-text>
    </v-card>
   </v-dialog>
</template>

<script lang="ts" setup>
import type { LeagueModel } from '~/models/betLeague';
import { useBetLeagueStore } from '~/stores/betLeaguesStore'
import { codeLengthRule } from '~/composables/rules'

const props = defineProps<{
  isShow: boolean
}>()

const { isShow } = toRefs(props)

const betLeagueStore = useBetLeagueStore()

const leagueCode = ref('')
const foundLeague = ref<LeagueModel | null>()
const errorMessage = computed(() => betLeagueStore.mess)

const emit = defineEmits<{
  (e: 'onClose'): void
}>()

function close() {
  emit('onClose')
}

async function searchLeague() {
  try {
    foundLeague.value = await betLeagueStore.fetchLeagueByCode(leagueCode.value)
  } catch (e) {
    console.log(e)
  }
}

async function joinLeague() {

}

function cancel() { 
  foundLeague.value = null
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
</script>

<style>

</style>
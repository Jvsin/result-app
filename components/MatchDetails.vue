<template>
  <v-dialog v-model="isShowRef" max-width="1200px" @update:model-value="closeDialog">
    <v-card>
      <v-card-title no-wrap class="text-center text-h5">
        {{ match.league.name }}
      </v-card-title>
      <v-card-subtitle no-wrap class="text-center">
        {{ formatTimestamp(match.fixture.timestamp) }}
      </v-card-subtitle>
      <v-row class="d-flex align-center" justify="center">
        <v-col cols="5" class="d-flex justify-center align-center">
          <v-card-item>
            <v-img class="mb-3" max-height="70" :src="match.teams.home.logo" aspect-ratio="1/1"></v-img>
            <v-card-text>{{ match.teams.home.name }}</v-card-text>
          </v-card-item>
        </v-col>
        <v-col cols="2" class="d-flex justify-center align-center">
          <v-card-item>
            <div v-if="match.goals.home != null" no-wrap class="text-center text-h4">{{ match.goals.home + ' - ' +
              match.goals.away }}</div>
            <div v-else no-wrap class="text-center text-h4">{{ ' - ' }}</div>
            <v-card-subtitle>
              <div v-if="match.goals.home != null" no-wrap class="text-center">{{ '(' +
                match.score.halftime.home + ' - ' + match.score.halftime.away +
                ')' }}
              </div>
            </v-card-subtitle>
            <v-card-subtitle v-if="match.fixture.status.short == 'FT' || match.fixture.status.short == 'NS'">
              <div no-wrap class="text-center">
                {{ $t(`leaguesPage.resultsView.${setTime(match.fixture.status.short)}`) }}
              </div>

            </v-card-subtitle>
            <div v-else style="color: red;" no-wrap class="text-center">
              {{ match.fixture.status.elapsed }}'
            </div>
          </v-card-item>
        </v-col>
        <v-col cols="5" class="d-flex justify-center align-center">
          <v-card-item>
            <v-img class="mb-3" max-height="70" :src="match.teams.away.logo" aspect-ratio="1/1"></v-img>
            <v-card-text>{{ match.teams.away.name }}</v-card-text>
          </v-card-item>
        </v-col>
      </v-row>

      <v-progress-linear v-if="match.fixture.status.short !== 'FT' && match.fixture.status.short !== 'NS'" color="red" height="5"
        :model-value="match.fixture.status.elapsed / 90 * 100" striped></v-progress-linear>

      <v-tabs v-model="tab" align-tabs="center" color="primary">
        <v-tab :key="0" value="0">{{ $t('leaguesPage.resultsView.basicData') }}</v-tab>
        <v-tab :key="1" value="1">{{ $t('leaguesPage.resultsView.squads') }}</v-tab>
        <v-tab :key="2" value="2">{{ $t('leaguesPage.resultsView.stats') }}</v-tab>
      </v-tabs>

      <v-divider :thickness="1" class="border-opacity-25 mx-2 mt-2 py-1" color="primary"></v-divider>
      <v-tabs-window v-model="tab">
        <v-tabs-window-item :value="1">
          <div v-if="!mobile">
            <v-row v-if="homeGoals.length || awayGoals.length" class="d-flex align-center" justify="center">
              <v-col cols="5" class="d-flex column justify-left align-center">
                <v-card-item prepend-icon="mdi-soccer" v-for="(goal, index) in homeGoals" :key="index">
                  {{ goal.minute + "' " + goal.scorer }}
                </v-card-item>
              </v-col>
              <v-col cols="2"></v-col>
              <v-col cols="5" class="d-flex column justify-right">
                <v-card-item prepend-icon="mdi-soccer" v-for="(goal, index) in awayGoals" :key="index">
                  {{ goal.minute + "' " + goal.scorer }}
                </v-card-item>
              </v-col>
            </v-row>
            <v-row v-else class="d-flex align-center" justify="center">
              <v-card-item> {{ $t('leaguesPage.errors.matchNotStarted')}} </v-card-item>
            </v-row>


            <v-divider :thickness="1" class="border-opacity-25 mx-2 mt-2 py-1" color="primary"></v-divider>

            <v-row class="d-flex align-center" justify="center">
              <v-col cols="6" class=" d-flex justify-center align-center">
                <v-card-item prepend-icon="mdi-stadium">
                  {{ match.fixture.venue.name + ", " + match.fixture.venue.city }}
                </v-card-item>
              </v-col>
              <v-col cols="6" class="d-flex justify-center align-center">
                <v-card-item prepend-icon="mdi-whistle">
                  {{ match.fixture.referee }}
                </v-card-item>
              </v-col>
            </v-row>

          </div>
          <div v-else>
            <v-row v-if="homeGoals.length || awayGoals.length" class="d-flex align-center" justify="center">
              <v-col cols="6" class="d-flex column justify-left align-center">
                <v-card-item prepend-icon="mdi-soccer" v-for="(goal, index) in homeGoals" :key="index">
                  {{ goal.minute + "' " + goal.scorer }}
                </v-card-item>
              </v-col>
              <v-col cols="6" class="d-flex column justify-right">
                <v-card-item prepend-icon="mdi-soccer" v-for="(goal, index) in awayGoals" :key="index">
                  {{ goal.minute + "' " + goal.scorer }}
                </v-card-item>
              </v-col>
            </v-row>
            <v-row v-else class="d-flex align-center" justify="center">
              <v-card-item> {{ $t('leaguesPage.errors.matchNotStarted') }}</v-card-item>
            </v-row>

            <v-divider :thickness="1" class="border-opacity-25 mx-2 mt-2 py-1" color="primary"></v-divider>

            <v-row class="d-flex align-center" justify="center">
              <v-card-item prepend-icon="mdi-stadium">
                {{ match.fixture.venue.name + ", " + match.fixture.venue.city }}
              </v-card-item>
              <v-card-item prepend-icon="mdi-whistle">
                {{ match.fixture.referee }}
              </v-card-item>
            </v-row>
          </div>
        </v-tabs-window-item>

        <v-tabs-window-item :value="2">
          <v-sheet no-gutters v-if="true" class="overflow-y-auto no-horizontal-scroll"
            style="max-height: 40vh; height: 100%;">
            <v-row v-if="homeLineUp.length || awayLineUp.length">
              <v-col cols="6" class="d-flex column justify-left">
                <v-row no-gutters justify="center">
                  <v-col cols="8">
                    <v-card-subtitle class="text-right" v-for="(player, index) in homeLineUp.slice(1, 12)" :key="index">
                      {{ player.name }}
                    </v-card-subtitle>
                  </v-col>
                  <v-col cols="4">
                    <v-card-subtitle class="text-left" v-for="(player, index) in homeLineUp.slice(1, 12)" :key="index">
                      {{ player.number }}
                    </v-card-subtitle>
                  </v-col>
                </v-row>


                <v-divider :thickness="1" class="border-opacity-25" color="primary"></v-divider>

                <v-row no-gutters>
                  <v-col cols="8">
                    <v-card-subtitle class="text-right" v-for="(player, index) in homeLineUp.slice(12,)" :key="index">
                      {{ player.name }}
                    </v-card-subtitle>
                  </v-col>
                  <v-col cols="4">
                    <v-card-subtitle class="text-left" v-for="(player, index) in homeLineUp.slice(12,)" :key="index">
                      {{ player.number }}
                    </v-card-subtitle>
                  </v-col>

                </v-row>

                <!-- <v-card-subtitle class="text-left py-2">
                  {{ "Trener: " + homeLineUp.slice[0].name }}
                </v-card-subtitle> -->
              </v-col>

              <v-col cols="6">
                <v-row no-gutters>
                  <v-col cols="4">
                    <v-card-subtitle class="text-right" v-for="(player, index) in awayLineUp.slice(1, 12)" :key="index">
                      {{ player.number }}
                    </v-card-subtitle>
                  </v-col>
                  <v-col cols="8">
                    <v-card-subtitle class="text-left" v-for="(player, index) in awayLineUp.slice(1, 12)" :key="index">
                      {{ player.name }}
                    </v-card-subtitle>
                  </v-col>
                </v-row>

                <v-divider :thickness="1" class="border-opacity-25" color="primary"></v-divider>

                <v-row no-gutters>
                  <v-col cols="4">
                    <v-card-subtitle class="text-right" v-for="(player, index) in awayLineUp.slice(12,)" :key="index">
                      {{ player.number }}
                    </v-card-subtitle>
                  </v-col>
                  <v-col cols="8">
                    <v-card-subtitle class="text-left" v-for="(player, index) in awayLineUp.slice(12,)" :key="index">
                      {{ player.name }}
                    </v-card-subtitle>
                  </v-col>
                </v-row>

                <!-- <v-card-subtitle class="text-right py-2">
                  {{ "Trener: " + awayLineUp[1].name }}
                </v-card-subtitle> -->
              </v-col>
            </v-row>
            <v-row v-else no-gutters justify="center">
              <div class="text-center">{{ $t('leaguesPage.errors.squadsNotAvailable') }} </div>
            </v-row>
            <v-divider :thickness="1" class="border-opacity-25" color="primary"></v-divider>
          </v-sheet>

        </v-tabs-window-item>

        <v-tabs-window-item :value="3">
          <v-sheet no-gutters v-if="matchStats.length" class="overflow-y-auto no-horizontal-scroll"
            style="max-height: 40vh; height: 100%;">
            <div v-for="(stat, index) in matchStats" :key="index">
              <v-row justify="center">
                <v-col>
                  <div class="text-center"> {{ stat.valueHome }}</div>
                </v-col>
                <v-col>
                  <v-card-subtitle class="text-center">{{ $t(`leaguesPage.statistics.${convertStatsName(stat.stat) }`)  }}</v-card-subtitle>

                </v-col>
                <v-col>
                  <div class="text-center"> {{ stat.valueAway }}</div>
                </v-col>
              </v-row>
            </div>
          </v-sheet>
          <v-sheet v-else>
            <div class="text-center">{{ $t('leaguesPage.errors.statsNotAvailable') }} </div>
          </v-sheet>
          <v-divider :thickness="1" class="border-opacity-25" color="primary"></v-divider>

        </v-tabs-window-item>

        <v-card-actions class="justify-center">
          <v-btn color="primary" @click="closeDialog">
            Zamknij
          </v-btn>
        </v-card-actions>
      </v-tabs-window>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { ref, watch, defineProps, toRefs } from 'vue';
import { useDisplay } from 'vuetify'

const props = defineProps<{
  match: any | null,
  isShow: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const { match, isShow } = toRefs(props)
const isShowRef = ref<boolean>(isShow.value)
const { mobile } = useDisplay()
const tab = ref(0)

watch(isShow, (newValue) => {
  isShowRef.value = newValue;
  if (isShowRef.value == true && match.value.fixture.status.short !== "NS" ) {
    setMatchDetails()
    setStatistics()
  }
});

function closeDialog() {
  isShowRef.value = false;
  homeGoals.splice(0, homeGoals.length);
  awayGoals.splice(0, awayGoals.length);
  homeLineUp.splice(0, homeLineUp.length)
  awayLineUp.splice(0, awayLineUp.length)
  matchStats.splice(0, matchStats.length)
  emit('close');
}

// stworzyć modele w przyszłości
const homeGoals: any = []
const awayGoals: any = []

const homeLineUp: any = []
const awayLineUp: any = []

const matchStats: any = []


function setMatchDetails() {
  console.log(match.value.events)
  if (isShowRef.value == true) {
    for (const detail of match.value.events) {
      if (detail.type == "Goal") {
        const goal: any = {
          minute: detail.time.elapsed,
          scorer: detail.player.name
        }
        if (detail.team.name === match.value.teams.home.name) {
          homeGoals.push(goal)
        }
        else {
          awayGoals.push(goal)
        }
      }
    }
    const homeCoach: any = {
      number: 0,
      name: match.value.lineups[0].coach.name
    }
    homeLineUp.push(homeCoach)
    const awayCoach: any = {
      number: 0,
      name: match.value.lineups[1].coach.name
    }
    awayLineUp.push(awayCoach)
    for (const element of match.value.lineups[0].startXI) { 
      const player: any = {
        number: element.player.number,
        name: element.player.name
      }
      homeLineUp.push(player)
    }
    for (const element of match.value.lineups[1].startXI) {
      const player: any = {
        number: element.player.number,
        name: element.player.name
      }
      awayLineUp.push(player)
    }

    for (const element of match.value.lineups[0].substitutes) {
      const player: any = {
        number: element.player.number,
        name: element.player.name
      }
      homeLineUp.push(player)
    }
    for (const element of match.value.lineups[1].substitutes) {
      const player: any = {
        number: element.player.number,
        name: element.player.name
      }
      awayLineUp.push(player)
    }
  }
  console.log(homeLineUp)
  console.log(awayLineUp)

  // console.log(homeGoals)
  // console.log(awayGoals)
}

function setStatistics() {
  for (const stat of match.value.statistics[0].statistics) {
    const awayStat = match.value.statistics[1].statistics.find((s: any) => s.type === stat.type);
    const element: any = {
      stat: stat.type,
      valueHome: stat.value,
      valueAway: awayStat.value
    }
    matchStats.push(element)
  }
  console.log(matchStats)
}


function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp * 1000);

  const day = date.getUTCDate().toString().padStart(2, '0');
  const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
  const year = date.getUTCFullYear();
  const hours = date.getUTCHours().toString().padStart(2, '0');
  const minutes = date.getUTCMinutes().toString().padStart(2, '0');

  return `${day}.${month}.${year}, ${hours}:${minutes}`;
}

function setTime(time: string) {
  switch (time) {
    case 'FT': return 'fullTime'
    case 'HT': return 'halfTime' 
    case 'NS': return 'notStarted'
  }
}

function convertStatsName(name: string) {
  if (name == 'Passes %')
    return 'passes'
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+(.)/g, (match, chr) => chr.toUpperCase()) 
    .replace(/^./, match => match.toLowerCase()); 
}
</script>

<style>
.column {
  display: flex;
  flex-direction: column;
}
.no-horizontal-scroll {
  overflow-x: hidden;
}
</style>
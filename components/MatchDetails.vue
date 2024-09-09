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
            <div no-wrap class="text-center text-h4">{{ match.goals.home + ' - ' + match.goals.away }}</div>
            <v-card-subtitle>
              <div no-wrap class="text-center">{{ '(' + match.score.halftime.home + ' - ' + match.score.halftime.away +
                ')' }}
              </div>
            </v-card-subtitle>
            <v-card-subtitle>
              <div no-wrap class="text-center">
                {{ match.fixture.status.short }}
              </div>
            </v-card-subtitle>
          </v-card-item>
        </v-col>
        <v-col cols="5" class="d-flex justify-center align-center">
          <v-card-item>
            <v-img class="mb-3" max-height="70" :src="match.teams.away.logo" aspect-ratio="1/1"></v-img>
            <v-card-text>{{ match.teams.away.name }}</v-card-text>
          </v-card-item>
        </v-col>
      </v-row>

      <v-tabs v-model="tab" align-tabs="center" color="primary">
        <v-tab :key="0" value="0">Ogólne</v-tab>
        <v-tab :key="1" value="1">Składy</v-tab>
        <v-tab :key="2" value="2">Statystyki</v-tab>
      </v-tabs>

      <v-divider :thickness="1" class="border-opacity-25 mx-2 mt-2 py-1" color="primary"></v-divider>
      <v-tabs-window v-model="tab">
        <v-tabs-window-item :value="1">
          <div v-if="!mobile">
            <v-row class="d-flex align-center" justify="center">
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
            <v-row class="d-flex align-center" justify="center">
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
          <v-sheet no-gutters v-if="true" class="overflow-y-auto no-horizontal-scroll">
            <v-row>
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

                <v-divider :thickness="1" class="border-opacity-25" color="primary"></v-divider>

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

                <v-divider :thickness="1" class="border-opacity-25" color="primary"></v-divider>

                <!-- <v-card-subtitle class="text-right py-2">
                  {{ "Trener: " + awayLineUp[1].name }}
                </v-card-subtitle> -->
              </v-col>
            </v-row>
          </v-sheet>

        </v-tabs-window-item>

        <v-tabs-window-item :value="3">
          stats
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
  if (isShowRef.value == true) {
    setMatchDetails()
  }
});

function closeDialog() {
  isShowRef.value = false;
  homeGoals.splice(0, homeGoals.length);
  awayGoals.splice(0, awayGoals.length);
  homeLineUp.splice(0, homeLineUp.length)
  awayLineUp.splice(0, awayLineUp.length)
  emit('close');
}

const homeGoals: any = []
const awayGoals: any = []

const homeLineUp: any = []
const awayLineUp: any = []

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
function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp * 1000);

  const day = date.getUTCDate().toString().padStart(2, '0');
  const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
  const year = date.getUTCFullYear();
  const hours = date.getUTCHours().toString().padStart(2, '0');
  const minutes = date.getUTCMinutes().toString().padStart(2, '0');

  return `${day}.${month}.${year}, ${hours}:${minutes}`;
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
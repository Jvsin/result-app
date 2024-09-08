<template>
  <v-dialog v-model="isShowRef" max-width="800px" @update:model-value="closeDialog">
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
            <div>{{ match.teams.home.name }}</div>
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
          </v-card-item>
        </v-col>
        <v-col cols="5" class="d-flex justify-center align-center">
          <v-card-item>
            <v-img class="mb-3" max-height="70" :src="match.teams.away.logo" aspect-ratio="1/1"></v-img>
            <div>{{ match.teams.away.name }}</div>
          </v-card-item>
        </v-col>
      </v-row>

      <v-row class="d-flex align-center" justify="center">
        <v-col cols="5" class="d-flex column justify-left">
          <div v-for="(goal, index) in homeGoals" :key="index">
            {{ goal.minute + "' " + goal.scorer }}
          </div>
        </v-col>
        <v-col cols="5" class="d-flex column justify-right">
          <div v-for="(goal, index) in awayGoals" :key="index">
            {{ goal.minute + "' " + goal.scorer }}
          </div>
        </v-col>
      </v-row>

      <v-divider :thickness="1" class="border-opacity-25 mx-2 mt-2 py-1" color="primary"></v-divider>


      <v-card-actions class="justify-end">
        <v-btn color="error" @click="closeDialog">
          Zamknij
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { ref, watch, defineProps, toRefs } from 'vue';

const props = defineProps<{
  match: any | null,
  isShow: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const { match, isShow } = toRefs(props)
const isShowRef = ref<boolean>(isShow.value)

watch(isShow, (newValue) => {
  isShowRef.value = newValue;
  if (isShowRef.value == true) {
    setMatchDetails()
  }
});

function closeDialog() {
  homeGoals.splice(0, homeGoals.length);
  awayGoals.splice(0, awayGoals.length);
  isShowRef.value = false;
  emit('close');
}

const homeGoals: any = []
const awayGoals: any = []

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
  }
  console.log(homeGoals)
  console.log(awayGoals)
}
function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp * 1000);

  const day = date.getUTCDate().toString().padStart(2, '0');
  const month = (date.getUTCMonth() + 1).toString().padStart(2, '0'); // Miesiące są 0-indeksowane
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
</style>
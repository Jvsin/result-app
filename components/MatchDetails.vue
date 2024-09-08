<template>
  <v-dialog v-model="isShowRef" max-width="800px">
    <v-card>
      <v-card-title>
        MECZ o id: {{ match.fixture.id }}
      </v-card-title>

      <v-card-text>
        <v-row justify="center" class="ma-4">
          {{ match }}
        </v-row>
      </v-card-text>

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
const leagueStore = useLeagueStore();

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
});

function closeDialog() {
  isShowRef.value = false;
  emit('close');
}
onMounted(() => {
  useLeagueStore
})
</script>

<style>

</style>
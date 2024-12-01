<template>
  <v-dialog :model-value="isShow" max-width="600" @update:model-value="close" >
    <v-card>
      <v-card-title class="align-center justify-center d-flex px-5 py-5">
        Zaproszenia do prywatnych lig
      </v-card-title>

      <v-card-actions>
        <v-btn variant="outlined" color="error" @click="close">{{ $t('user.betLeaguesSites.cancel') }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { useInvitationStore } from '~/stores/invitationStore';

const props = defineProps<{
  isShow: boolean
}>()

const { isShow } = toRefs(props)

const emit = defineEmits<{
  (e: 'onClose'): void
}>()

function close() {
  emit('onClose')
}

const invitationStore = useInvitationStore()

const userInvitations = computed(() => invitationStore.allUserInvitations)
</script>

<style>

</style>
<template>
  <div>
    <v-btn color="primary" variant="outlined" prepend-icon="mdi-calendar" @click="dialog = true">{{ $t('user.betLeaguesSites.editDialog.chooseDate') }}</v-btn>

    <v-dialog max-width="fit-content" v-model="dialog" persistent>
      <v-card>
        <v-card-title class="headline">{{ $t('user.betLeaguesSites.editDialog.chooseDate') }}</v-card-title>
        
        <v-card-text>
          <v-date-picker v-model="selectedDate" @input="save" :locale="locale"
          />
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" @click="dialog = false">{{ $t('user.betLeaguesSites.editDialog.cancel') }}</v-btn>
          <v-btn color="primary" @click="save">{{ $t('user.betLeaguesSites.editDialog.save') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts" setup>
import { Timestamp } from 'firebase/firestore';
import { useI18n } from 'vue-i18n';
import { useLocale } from 'vuetify'

const dialog = ref(false)
const selectedDate = ref()

const { locale } = useI18n()
const { current } = useLocale()

const emit = defineEmits<{
  (e: 'onClose'): void,
  (e: 'onSave', date: Number): void
}>()

function save() {
  if (selectedDate.value) {
    const date = new Date(selectedDate.value);
    const timestamp = Timestamp.fromDate(date);
    
    emit('onSave', timestamp.seconds);
  }
  selectedDate.value = null
  emit('onClose')
  dialog.value = false
}

watch(locale, (newLocale) => {
  current.value = newLocale;
});
</script>

<style>

</style>
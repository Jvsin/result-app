<script setup lang="ts">
import { useDisplay } from 'vuetify'

// const { t, locale } = useI18n()

// const languages = [
//   { title: t('lang.pl'), value: 'pl' },
//   { title: t('lang.en'), value: 'en' },
// ]

const route = useRoute()
const activePath = computed(() => route.fullPath)

// watch(locale, (newLocale, oldLocal) => {
//   if (newLocale !== oldLocal && userData.value)
//     userStore.updateLang(newLocale as 'en' | 'pl')
// })

const { mobile } = useDisplay()
const drawer = ref(false)
const themeItems = [
  { title: 'Jasny', value: 'light' },
  { title: 'Ciemny', value: 'dark' },
]

function onClickDrawerItem() {
  if (mobile.value)
    drawer.value = false
}
</script>

<template>
  <v-app-bar >
    <template #prepend>
      <v-app-bar-nav-icon
        v-if="mobile"
        @click.stop="drawer = !drawer"
      />
    </template>

    <v-btn
      :class="mobile ? '' : 'ml-2'"
      variant="text"
      color="primary"
      :active="false"
      to="/"
      prepend-icon="mdi-home"
      text="Match Results App"
    />

    <v-spacer />

    <div
      v-if="!mobile"
      class="flex align-center"
    >

      <v-select
        class="mx-2"
        variant="plain"
        hide-details
        :items="themeItems"
        label="Motyw"
      />
    </div>

    <v-menu>
      <template #activator="{ props }">
        <v-btn
          color="primary"
          variant="elevated"
          v-bind="props"
          icon
        >
          <v-avatar
            size="40"
          />
        </v-btn>
      </template>
      <v-list>
        <v-list-subheader>
          User
        </v-list-subheader>

        <v-list-item
          append-icon="mdi-logout"
        />
      </v-list>
    </v-menu>
  </v-app-bar>

  <v-navigation-drawer
    v-if="mobile"
    v-model="drawer"
    temporary
  >
    <v-list
      nav
      color="primary"
    >

      <v-select
        class="pa-2"
        variant="plain"
        :items="themeItems"
        hide-details
        label="Motyw"
      />
    </v-list>
  </v-navigation-drawer>
</template>

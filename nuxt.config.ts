import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
import i18nConfig from './i18n.config';
import pl from './locales/pl.json';
import en from './locales/en.json';

export default defineNuxtConfig({
  //...
  build: {
    transpile: ['vuetify'],
  },

  modules: [
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }))
      })
    },
    '@pinia/nuxt',
    '@nuxtjs/i18n',
  ],

  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },

  i18n: {
    strategy: 'no_prefix',
    defaultLocale: 'pl',
    vueI18n: './i18n.config.ts',
  },
  devtools: { enabled: true },

  css: [
    '@mdi/font/css/materialdesignicons.css', // Import the MDI font styles
    // '@flaticon/flaticon-uicons/css/all/all.css',
  ],

  plugins: ['~/plugins/vuetify.ts'],

  compatibilityDate: '2024-08-16',
})
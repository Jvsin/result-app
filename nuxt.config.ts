import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
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
    //...
  ],

  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },

  css: [
    '@mdi/font/css/materialdesignicons.css', // Import the MDI font styles
    // '@flaticon/flaticon-uicons/css/all/all.css',
  ],

  plugins: ['~/plugins/vuetify.ts'],

  compatibilityDate: '2024-08-16',
})
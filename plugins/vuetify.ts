import { createVuetify } from 'vuetify';
import 'vuetify/styles'; // Global CSS has to be imported
import { aliases, mdi } from 'vuetify/iconsets/mdi';

export default defineNuxtPlugin(nuxtApp => {
  const vuetify = createVuetify({
    icons: {
      defaultSet: 'mdi',
      aliases,
      sets: {
        mdi,
      },
    },
    theme: {
      defaultTheme: 'dark',
      themes: {
        light: {
          colors: {
            primary: '#1867C0',
            secondary: '#5CBBF6',
          },
        },
        dark: {
            colors: {
              primary: '#3B3333',
              secondary: '#FFFFFF',
            },
          },
      },
    },
  });

  nuxtApp.vueApp.use(vuetify);
});

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
            primary: '#7DDA58',
            secondary: '#7DDA58',
          },
        },
        dark: {
            colors: {
              primary: '#7DDA58',
              secondary: '#7DDA58',
            },
          },
      },
    },
  });

  nuxtApp.vueApp.use(vuetify);
});

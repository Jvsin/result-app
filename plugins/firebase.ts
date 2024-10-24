// plugins/firebase.ts
import { defineNuxtPlugin } from '#app';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export default defineNuxtPlugin(nuxtApp => {
  const config = useRuntimeConfig().public;

  // const firebaseConfig = {
  //   apiKey: config.firebaseApiKey,
  //   authDomain: config.firebaseAuthDomain,
  //   projectId: config.firebaseProjectId,
  //   storageBucket: config.firebaseStorageBucket,
  //   messagingSenderId: config.firebaseMessagingSenderId,
  //   appId: config.firebaseAppId,
  //   measurementId: config.firebaseMeasurementId
  // };

  const firebaseConfig = {
    apiKey: 'AIzaSyCVFwklzjj9SExwgGIOVnUU9cG1zW9thO0',
    authDomain: 'match-results-app.firebaseapp.com',
    projectId: 'match-results-app',
    storageBucket: 'match-results-app.appspot.com',
    messagingSenderId: '764853339407',
    appId: '1:764853339407:web:1042a328c4dc8390fdea7a',
    measurementId: 'G-PEBMT0D4Z1'
  };

  const app = initializeApp(firebaseConfig);

  const db = getFirestore(app);
  const auth = getAuth(app);

  nuxtApp.provide('firebase', { app, db, auth });
});

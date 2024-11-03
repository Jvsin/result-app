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
    apiKey: config.firebaseApiKey,
    authDomain: config.firebaseAuthDomain,
    projectId: config.firebaseProjectId,
    storageBucket: config.firebaseStorageBucket,
    messagingSenderId: config.firebaseMessagingSenderId,
    appId: config.firebaseAppId,
    measurementId: config.firebaseMeasurementId
  };

  const app = initializeApp(firebaseConfig);

  const db = getFirestore(app);
  const auth = getAuth(app);

  nuxtApp.provide('firebase', { app, db, auth });
});

<template>
  <div>
    <div>{{ console.log(Timestamp.now()) }}</div>
    <v-btn @click="processBetsHTTP">Wywołaj</v-btn>
  </div>
</template>

<script lang="ts" setup>
import { Timestamp } from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";

const functions = getFunctions();
const processBetsHTTP = httpsCallable(functions, 'processBetsHTTP');

async function testLocally() {}
</script>

<style>

</style>
import { initializeApp } from 'firebase/app'
import { browserLocalPersistence, browserPopupRedirectResolver, indexedDBLocalPersistence, initializeAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  const firebaseConfig = {
    // tu wklej konfig
  };

  const app = initializeApp(firebaseConfig)

  const auth = initializeAuth(app, {
    persistence: [indexedDBLocalPersistence, browserLocalPersistence],
    popupRedirectResolver: browserPopupRedirectResolver,
  })

  const firestore = getFirestore(app)
  const storage = getStorage(app)

  nuxtApp.vueApp.provide(
    'auth',
    auth,
  )
  nuxtApp.provide(
    'auth',
    auth,
  )

  nuxtApp.vueApp.provide(
    'firestore',
    firestore,
  )
  nuxtApp.provide(
    'firestore',
    firestore,
  )

  nuxtApp.vueApp.provide(
    'storage',
    storage,
  )
  nuxtApp.provide(
    'storage',
    storage,
  )
})

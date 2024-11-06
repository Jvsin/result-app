import { useAuthStore } from '~/stores/authStore';
// import { navigateTo, useNuxtApp, defineNuxtRouteMiddleware } from 'nuxt3';

export default defineNuxtRouteMiddleware(async () => {
  const { $firebase } = useNuxtApp();
  const auth = $firebase.auth;
  const authStore = useAuthStore();

  await authStore.initializeAuth();  
    
    console.log("Firebase currentUser:", authStore.user);
  console.log("Pinia loggedUserData:", authStore.loggedUserData);

    if (!authStore.user && !authStore.loggedUserData) {
        return navigateTo('/');
    }
    //   await auth.authStateReady();
    
//   if (!auth.currentUser && !authStore.loggedUserData) {
//     return navigateTo('/');
    //   }
});
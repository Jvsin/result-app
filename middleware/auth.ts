export default defineNuxtRouteMiddleware(async () => {
    const { $firebase } = useNuxtApp();
    const auth = $firebase.auth;

    await auth.authStateReady()

    if (!auth.currentUser)
        return navigateTo('/')
})
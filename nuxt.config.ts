// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  runtimeConfig: {
    jwtSecret: process.env.JWT_SECRET
  },
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  tiptap: {
    prefix: 'Tiptap' //prefix for Tiptap imports, composables not included
  },
  modules: ['@nuxtjs/tailwindcss', '@nuxt/icon', 'nuxt-tiptap-editor', 'v-gsap-nuxt']
})

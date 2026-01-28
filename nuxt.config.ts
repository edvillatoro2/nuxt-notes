// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  runtimeConfig: {
    jwtSecret: process.env.JWT_SECRET
  },
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [tailwindcss()]
  },
  tiptap: {
    prefix: 'Tiptap' //prefix for Tiptap imports, composables not included
  },
  modules: ['@nuxt/icon', 'nuxt-tiptap-editor']
})

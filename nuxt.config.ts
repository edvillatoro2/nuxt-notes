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
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> dbd522f (working token on SSR and CSR)
  modules: ['@nuxt/icon']
})
=======

  modules: ['@nuxt/icon']
})
>>>>>>> ce1d4504fdc2bcd708e28eee17510c28ba8ad897

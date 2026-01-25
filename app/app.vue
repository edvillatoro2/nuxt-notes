<template>
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> dbd522f (working token on SSR and CSR)
  <div>
    <NuxtPage />
  </div>
</template>
<script setup lang="ts">
<<<<<<< HEAD
const route = useRoute()
</script>
=======
  <div class="">
    <header
      style="
        background: rgba(255, 255, 255, 0.2);
        border-radius: 4px;
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.25);
        backdrop-filter: blur(2.25px);
        -webkit-backdrop-filter: blur(9.3px);
        border: 1px solid rgba(255, 255, 255, 0.81);
      "
      class="fixed top-0 right-0 z-10 m-2"
    >
      <nav>
        <ul class="flex justify-end gap-4 p-4">
          <li class="hover:text-amber-500"><NuxtLink to="/">Home</NuxtLink></li>
          <li class="hover:text-amber-500"><NuxtLink to="/register">Register</NuxtLink></li>
          <li class="hover:text-amber-500"><NuxtLink to="/login">Login</NuxtLink></li>
        </ul>
      </nav>
    </header>
    <NuxtPage />
  </div>
</template>
>>>>>>> ce1d4504fdc2bcd708e28eee17510c28ba8ad897
=======
const { fetchUser } = useAuth()

onMounted(() => {
  fetchUser()
})
</script>
>>>>>>> dbd522f (working token on SSR and CSR)

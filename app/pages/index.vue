<template>
  <div class="container">
    <h1 class="text-3xl font-bold underline">Hello world!</h1>
    <header>
      <nav>
        <ul>
          <li><NuxtLink to="/register">Register</NuxtLink></li>
          <li><NuxtLink to="/login">Login</NuxtLink></li>
        </ul>
      </nav>
    </header>
    <!-- <NuxtRouteAnnouncer /> -->
    <NuxtPage />
  </div>
</template>
<script setup lang="ts">
const route = useRoute()
console.log(route.params.id)
// import register from '../pages/register.vue'
// import login from '../pages/login.vue'
</script>

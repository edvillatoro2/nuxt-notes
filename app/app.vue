<template>
  <div>
    <NuxtPage />
    <GlobalModal />
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { fetchUser } = useAuth()

onMounted(() => {
  fetchUser()
})
</script>

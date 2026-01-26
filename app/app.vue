<template>
  <div>
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { fetchUser } = useAuth()

onMounted(() => {
  fetchUser()
})
</script>
const { fetchUser } = useAuth()

onMounted(() => {
  fetchUser()
})
</script>

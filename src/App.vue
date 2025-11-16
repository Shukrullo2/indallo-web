<template>
  <router-view />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuth } from './composables/useAuth'

const { initAuth, handleAuthCallback } = useAuth()

onMounted(() => {
  initAuth()
  handleAuthCallback()
})
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background-color: #f0f0f0;
  color: #000;
  line-height: 1.5;
}

#app {
  min-height: 100vh;
}
</style>

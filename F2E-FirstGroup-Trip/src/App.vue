<script setup>
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
  <div v-if="$route.path !== '/map'">
    <RouterLink to="/map">景點地圖</RouterLink>
  </div>
  <RouterView />
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
}
#app {
  margin: 0;
  padding: 0;
}
</style>

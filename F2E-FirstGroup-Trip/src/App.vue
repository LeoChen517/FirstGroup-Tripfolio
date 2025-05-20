<script setup>
import { RouterLink, RouterView } from "vue-router";
import HelloWorld from "./components/HelloWorld.vue";
</script>

<template>
  <div v-if="$route.path !== '/map'">
    <RouterLink to="/map">景點地圖</RouterLink>
  </div>
  <RouterView />
</template>

<style scoped></style>

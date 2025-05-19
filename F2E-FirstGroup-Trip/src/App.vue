<script setup>
import { RouterLink, RouterView } from 'vue-router';

</script>

<template>
  <div>
    <nav>
      <router-link to="/profile">會員基本資料</router-link>
    </nav>
    <router-view />
  </div>
</template>

<style>

</style>

//會員頁

<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { RouterView } from 'vue-router';

</script>

<template>
    <h2>Profile</h2>
    <RouterLink to="/user/789/profile">Profile</RouterLink>
    <RouterView></RouterView>
</template>
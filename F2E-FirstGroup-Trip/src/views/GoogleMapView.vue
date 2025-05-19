<template>
  <div
    ref="mapRef"
    class="map-container"
    style="width: 100vw; height: 100vh"
  ></div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const mapRef = ref(null);

onMounted(() => {
  // 等待 Google Maps API 載入完成
  const waitForGoogleMaps = () =>
    new Promise((resolve) => {
      if (window.google && window.google.maps) {
        resolve();
      } else {
        // 如果還沒載入好，每 100ms 檢查一次
        const interval = setInterval(() => {
          if (window.google && window.google.maps) {
            clearInterval(interval);
            resolve();
          }
        }, 100);
      }
    });

  waitForGoogleMaps().then(() => {
    const map = new window.google.maps.Map(mapRef.value, {
      center: { lat: 25.033964, lng: 121.564472 }, // 台北101
      zoom: 14,
    });

    new window.google.maps.Marker({
      position: { lat: 25.033964, lng: 121.564472 },
      map,
      title: "台北 101",
    });
  });
});
</script>

<style scoped>
html,
body,
#app {
  margin: 0;
  padding: 0;
  height: 100%;
}
.map-container {
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
}
</style>

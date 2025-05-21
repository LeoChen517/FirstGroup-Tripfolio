<template>
  <div ref="mapRef" class="map-container"></div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const mapRef = ref(null);

function loadGoogleMaps() {
  return new Promise((resolve, reject) => {
    if (window.google && window.google.maps) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${
      import.meta.env.VITE_GOOGLE_MAPS_API_KEY
    }`;
    script.async = true;
    script.defer = true;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}
onMounted(async () => {
  try {
    await loadGoogleMaps();
    new google.maps.Map(mapRef.value, {
      center: { lat: 25.033964, lng: 121.564472 }, // 這裡以台北101為例
      zoom: 15,
    });
  } catch (err) {
    alert("❌ Google Maps 載入失敗");
    console.error(err);
  }
});
</script>

<style scoped>
.map-container {
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
}
</style>

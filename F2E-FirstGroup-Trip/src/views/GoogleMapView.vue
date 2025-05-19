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

function loadGoogleMaps() {
  return new Promise((resolve, reject) => {
    if (window.google && window.google.maps) {
      resolve();
      return;
    }
    // const script = document.createElement("script");
    // script.src = `https://maps.googleapis.com/maps/api/js?key=${
    //   import.meta.env.VITE_GOOGLE_MAPS_API_KEY
    // }`;
    // script.async = true;
    // script.defer = true;
    // script.onload = resolve;
    // script.onerror = reject;
    // document.head.appendChild(script);
  });
}
onMounted(async () => {
  try {
    await loadGoogleMaps();

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLatLng = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          const map = new google.maps.Map(mapRef.value, {
            center: userLatLng,
            zoom: 15,
          });

          new google.maps.Marker({
            position: userLatLng,
            map,
            title: "你在這裡！",
          });
        },
        () => {
          alert("⚠️ 無法取得你的定位！");
        }
      );
    } else {
      alert("你的瀏覽器不支援定位功能");
    }
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

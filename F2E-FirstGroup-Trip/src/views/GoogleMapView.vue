<!-- components/GoogleMapView.vue -->
<script setup>
import { ref, onMounted } from "vue";
import { Loader } from "@googlemaps/js-api-loader";
import UserLocationMarker from "../components/MapComponent/UserLocationMarker.vue";
import NearbyPlaces from "../components/MapComponent/NearbyPlaces.vue";

const mapRef = ref(null);
const map = ref(null);
const userLocation = ref(null);

onMounted(async () => {
  const loader = new Loader({
    apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    version: "weekly",
    libraries: ["places"],
  });

  try {
    await loader.load();
    map.value = new google.maps.Map(mapRef.value, {
      center: { lat: 25.033964, lng: 121.564472 },
      zoom: 15,
    });
  } catch (error) {
    console.error("地圖載入失敗", error);
  }
});
</script>

<template>
  <div ref="mapRef" class="map-container" />
  <UserLocationMarker
    v-if="map"
    :map="map"
    @update:location="userLocation = $event"
  />
  <NearbyPlaces
    v-if="map && userLocation"
    :map="map"
    :location="userLocation"
  />
</template>

<style scoped>
.map-container {
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
}
</style>

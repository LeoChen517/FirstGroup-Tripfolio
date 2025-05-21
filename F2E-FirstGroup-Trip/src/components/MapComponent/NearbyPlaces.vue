<!-- components/MapComponent/NearbyPlaces.vue -->
<script setup>
import { watch, ref } from "vue";

const props = defineProps({
  map: Object,
  location: Object,
});

const markers = ref([]);

function clearMarkers() {
  markers.value.forEach((m) => m.setMap(null));
  markers.value = [];
}

function loadNearbyPlaces(center) {
  if (!props.map || !center) return;

  clearMarkers();

  const service = new google.maps.places.PlacesService(props.map);

  const request = {
    location: center,
    radius: 1000,
    type: ["tourist_attraction"], // 你可以改成 library, cafe 等
  };

  service.nearbySearch(request, (results, status) => {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      results.forEach((place) => {
        const marker = new google.maps.Marker({
          map: props.map,
          position: place.geometry.location,
          title: place.name,
        });
        markers.value.push(marker);
      });
    }
  });
}

watch(
  () => props.location,
  (newLocation) => {
    if (newLocation) {
      loadNearbyPlaces(newLocation);
    }
  },
  { immediate: true }
);
</script>
<template>
  <div></div>
</template>

<script setup>
import { onMounted, watch, ref } from "vue";

const props = defineProps({
  map: Object,
  location: Object, // { lat, lng }
});

const markers = ref([]);

onMounted(() => {
  watch(
    () => props.location,
    (newLocation) => {
      if (!newLocation || !props.map) return;
      loadNearbyPlaces(newLocation);
    },
    { immediate: true }
  );
});

function loadNearbyPlaces(center) {
  // 清除舊的標記
  markers.value.forEach((marker) => marker.setMap(null));
  markers.value = [];

  const service = new google.maps.places.PlacesService(props.map);
  const request = {
    location: center,
    radius: 1000, // 公尺內
    type: ["tourist_attraction"], // 顯示旅遊景點
  };

  service.nearbySearch(request, (results, status) => {
    if (status === google.maps.places.PlacesServiceStatus.OK && results) {
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
</script>

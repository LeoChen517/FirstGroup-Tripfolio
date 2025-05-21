<script setup>
import { onMounted, onBeforeUnmount } from "vue";

const props = defineProps({ map: Object });
const emit = defineEmits(["update:location"]);

let marker = null;

onMounted(() => {
  if (!props.map) return;

  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latLng = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        marker = new google.maps.Marker({
          position: latLng,
          map: props.map,
          title: "你在這裡",
        });

        props.map.setCenter(latLng);
        emit("update:location", latLng);
      },
      (error) => {
        alert("⚠️ 定位失敗：" + error.message);
      }
    );
  }
});

onBeforeUnmount(() => {
  if (marker) marker.setMap(null);
});
</script>
<template>
  <div></div>
</template>

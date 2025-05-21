<script setup>
import { onMounted, onBeforeUnmount } from "vue";

const props = defineProps({
  map: Object,
});

let marker = null;
// 加上 emit 位置給父元件
const emit = defineEmits(["update:location"]);

onMounted(() => {
  if (!props.map) return;

  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLatLng = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        // 建立/更新 marker
        marker = new google.maps.Marker({
          position: userLatLng,
          map: props.map,
          title: "你在這裡！",
        });

        props.map.setCenter(userLatLng);
      },
      (err) => {
        alert(`⚠️ 無法取得定位：${err.message}`);
      }
    );
  } else {
    alert("你的瀏覽器不支援定位功能");
  }
});

onBeforeUnmount(() => {
  if (marker) {
    marker.setMap(null); // 移除 marker
    marker = null;
  }
});
</script>

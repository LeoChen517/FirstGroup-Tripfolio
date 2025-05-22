<template>
  <div ref="mapRef" class="map-container"></div>
  <div v-if="result">
    <p>兩點距離：{{ result.distance }}，預估時間：{{ result.duration }}</p>
  </div>
  <button @click="reset">🔁 重設選點</button>
</template>

<script setup>
import { ref, onMounted } from "vue";

const mapRef = ref(null);
const result = ref(null);
let map;
let markers = [];

// 載入 Google Maps API
function loadGoogleMaps() {
  return new Promise((resolve, reject) => {
    if (window.google && window.google.maps) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`;
    script.async = true;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

// 計算距離和時間
function calculateDistance(origin, destination) {
  const service = new google.maps.DistanceMatrixService();
  service.getDistanceMatrix(
    {
      origins: [origin],
      destinations: [destination],
      travelMode: "DRIVING",
    },
    (response, status) => {
      if (status === "OK") {
        const element = response.rows[0].elements[0];
        result.value = {
          distance: element.distance.text,
          duration: element.duration.text,
        };
      } else {
        alert("查詢距離失敗：" + status);
      }
    }
  );
}

onMounted(async () => {
  await loadGoogleMaps();

  map = new google.maps.Map(mapRef.value, {
    center: { lat: 25.033964, lng: 121.564472 }, // 台北101
    zoom: 14,
  });

  map.addListener("click", (e) => {
    if (markers.length >= 2) return;

    const marker = new google.maps.Marker({
      position: e.latLng,
      map,
    });

    markers.push(marker);

    if (markers.length === 2) {
      const origin = markers[0].getPosition();
      const destination = markers[1].getPosition();
      calculateDistance(origin, destination);
    }
  });
});
  function reset() {
    result.value = null;
    markers.forEach(marker => marker.setMap(null));
    markers = [];
  }
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 70vh;
}
</style>
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
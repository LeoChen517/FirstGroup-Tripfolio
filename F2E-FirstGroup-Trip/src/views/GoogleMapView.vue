<template>
  <div ref="mapRef" class="map-container"></div>
  <div class="controls">
    <div v-if="result">
      <p>兩點距離：{{ result.distance }}，預估時間：{{ result.duration }}</p>
    </div>
  
    <label>選擇交通方式：
      <select v-model="travelMode" @change="recalculateRoute">
      <option value="DRIVING">🚗 開車</option>
      <option value="WALKING">🚶‍♀️ 步行</option>
      <option value="BICYCLING">🚴‍♂️ 腳踏車</option>
      <option value="TRANSIT">🚇 大眾運輸</option>
      </select>
    </label>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const mapRef = ref(null);
const result = ref(null);
const travelMode = ref("DRIVING");
let map;
let markers = [];
let directionsService, directionsRenderer;

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
function calculateRoute(origin, destination) {
  directionsService.route(
    {
      origin,
      destination,
      travelMode: travelMode.value,
    },
    (response, status) => {
      if (status === "OK") {
        directionsRenderer.setDirections(response);

        const leg = response.routes[0].legs[0];
        result.value = {
          distance: leg.distance.text,
          duration: leg.duration.text,
        };
      } else {
        alert("路線規劃失敗：" + status);
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

  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer({
  suppressMarkers: true, 
  });
  directionsRenderer.setMap(map);


// 地圖上添加標記
  map.addListener("click", (e) => {
    if (markers.length >= 2) reset();

    const marker = new google.maps.Marker({
      position: e.latLng,
      map,
    });

    markers.push(marker);

    if (markers.length === 2) {
      const origin = markers[0].getPosition();
      const destination = markers[1].getPosition();
      calculateRoute(origin, destination);
    }
  });
});

// 重設地圖和標記
  function reset() {
    result.value = null;
    markers.forEach(marker => marker.setMap(null));
    markers = [];
    if (directionsRenderer) {
      directionsRenderer.setDirections({ routes: [] });
    }
  }
//  重新計算路線
  function recalculateRoute() {
  if (markers.length === 2) {
    calculateRoute(markers[0].getPosition(), markers[1].getPosition());
  }
}

</script>

<style scoped>
.map-container {
  width: 100%;
  height: 100vh;
  position: relative;
}

.controls {
  position: absolute;
  bottom: 40px;
  left: 20px;
  background: rgba(255, 255, 255, 0.9);
  padding: 8px 12px;
  border-radius: 6px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.3);
  display: flex;
  gap: 10px;
  align-items: center;
  z-index: 1;
}

</style>
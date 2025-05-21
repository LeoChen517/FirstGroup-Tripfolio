<template>
  <input
    type="text"
    v-model="searchQuery"
    placeholder="搜尋地點"
    class="search-input"
    ref="searchInput"
    @keyup.enter="searchPlace"
  />
  <div
    ref="mapRef"
    class="map-container"
    style="width: 100vw; height: 100vh"
  ></div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const mapRef = ref(null);
const searchQuery = ref("");
const searchInput = ref(null);

let map = null;
let markers = [];

function loadGoogleMaps() {
  return new Promise((resolve, reject) => {
    if (window.google && window.google.maps) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${
      import.meta.env.VITE_GOOGLE_MAPS_API_KEY
    }&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

//因為code太長我先獨立出來
function initMap(userLatLng) {
  map = new google.maps.Map(mapRef.value, {
    center: { lat: 25.033964, lng: 121.564472 },
    zoom: 15,
    mapTypeControl: false,
    zoomControl: false,
    cameraControl: false,
    scaleControl: false,
    fullscreenControl: false,
    errorControl: true,
    streetViewControl: false,
    streetViewControlOptions: {
      position: google.maps.ControlPosition.LEFT_TOP,
    }, //我先把控件關掉，有需要再開
  });
}

function searchPlace() {
  if (!searchQuery.value || !map) return;

  const service = new google.maps.places.PlacesService(map);

  const request = {
    query: searchQuery.value,
    fields: ["name", "geometry", "place_id"], // 回傳的資料欄位
  };

  service.findPlaceFromQuery(request, (results, status) => {
    if (status === google.maps.places.PlacesServiceStatus.OK && results) {
      // 清除舊標記
      markers.forEach((marker) => marker.setMap(null));
      markers = [];

      const place = results[0]; // 只拿第一個結果
      if (!place.geometry || !place.geometry.location) return;

      // 地圖中心移到搜尋結果
      map.setCenter(place.geometry.location);

      // 加入新標記
      const marker = new google.maps.Marker({
        map,
        position: place.geometry.location,
        title: place.name,
      });
      markers.push(marker);
    } else {
      placeDetails.value = null;
      alert("找不到地點！");
    }
  });
}

onMounted(async () => {
  try {
    await loadGoogleMaps();
    initMap();
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
.search-input {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 999;
  padding: 10px;
  width: 300px;
  border-radius: 20px;
  border: none;
  font-size: 16px;
  background-color: rgb(182, 176, 176, 0.9);
}
.search-input::placeholder {
  color: white;
}
</style>

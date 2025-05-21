<template>
  <div class="search-container"><input
    type="text"
    v-model="searchQuery"
    placeholder="搜尋地點"
    class="search-input"
    ref="searchInput"
    @keyup.enter="searchPlace"
  />
  <label class="toggle-switch">
    <input type="checkbox" v-model="isToggled" />
    <span class="slider"></span>
  </label></div>
  <div v-show="!isToggled"
    ref="mapRef"
    class="map-container"
    style="width: 100vw; height: 100vh"
  ></div>

  <div v-show="isToggled" v-if="placeDetails" class="info-panel">
    <h2>{{ placeDetails.name }}</h2>
    <p>{{ placeDetails.formatted_address }}</p>
    <div v-if="placeDetails.photos && placeDetails.photos.length">
      <img
        :src="placeDetails.photos[0].getUrl({ maxWidth: 400 })"
        alt="地點圖片"
        style="margin-top: 10px; max-width: 100%; border-radius: 10px"
      />
    </div>
    <p v-if="placeDetails.rating">
      ⭐ {{ placeDetails.rating }}（共
      {{ placeDetails.user_ratings_total }} 則評價）
    </p>
  </div>

</template>

<script setup>
import { ref, onMounted } from "vue";

const mapRef = ref(null);
const searchQuery = ref("");
const searchInput = ref(null);
const isToggled = ref(false);
const placeDetails = ref(null);

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
      //
      const detailRequest = {
        placeId: place.place_id,
        fields: [
          "name",
          "formatted_address",
          "formatted_phone_number",
          "opening_hours",
          "photos",
          "rating",
          "user_ratings_total",
          "website",
        ],
      };
      service.getDetails(detailRequest, (detailResult, detailStatus) => {
        if (detailStatus === google.maps.places.PlacesServiceStatus.OK) {
          placeDetails.value = detailResult;
        } else {
          console.warn("取得詳細資料失敗：", detailStatus);
        }
      });

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

.search-container {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 999;
  display: flex;
  align-items: center;
  gap: 10px; /* 元素間距 */
  background-color: rgba(182, 176, 176, 0.9);
  padding: 10px;
  border-radius: 50px;
}
.search-input {
  color: white;
  padding: 8px 12px;
  width: 300px;
  border-radius: 30px;
  border: none;
  font-size: 16px;
  background-color: rgba(129, 129, 129, 0.7);
}
.search-input::placeholder {
  color: white;
}

/* Toggle Switch 樣式 */
.toggle-switch {
  position: relative;
  display: inline-block;
  width: 80px;
  height: 34px;
}
/* 隱藏checkbox */
.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.3s;
  border-radius: 30px;
}
.slider::before {
  position: absolute;
  content: "地圖"; /* 預設為關 */
  height: 28px;
  width: 50px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.3s;
  border-radius: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  color: black;
}
/* 切換開啟狀態 */
.toggle-switch input:checked + .slider {
  background-color: rgb(138, 134, 134);
}
.toggle-switch input:checked + .slider::before {
  transform: translateX(24px);
  content: "卡片"; /* 開的狀態 */
}
.info-panel {
  position: absolute;
  top: 80px;
  left: 10px;
  z-index: 1000;
  background: white;
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  width: 320px;
  max-height: 90vh;
  overflow-y: auto;
}

</style>

<template>
  <div class="search-container">
    <div class="search-wrapper">
      <input
        type="text"
        v-model="searchQuery"
        placeholder="搜尋地點"
        class="search-input"
        ref="searchInput"
        @keyup.enter="searchPlace"
      />
      <button @click.prevent="searchPlace" class="search-btn">🔍</button>
    </div>
    <label class="toggle-switch">
      <input type="checkbox" v-model="isToggled" />
      <span class="slider"></span>
    </label>
  </div>
  <div
    v-show="!isToggled"
    ref="mapRef"
    class="map-container"
    style="width: 100vw; height: 100vh"
  ></div>
  <div v-show="isToggled" v-if="placeDetails.length" class="info-panel">
    <div v-for="(place, index) in placeDetails" :key="index" class="place-card">
      <h2 :title="place.name">{{ place.name }}</h2>
      <p :title="place.formatted_address">{{ place.formatted_address }}</p>
      <div v-if="place.photos && place.photos.length">
        <img
          :src="place.photos[0].getUrl({ maxWidth: 400 })"
          alt="地點圖片"
          style="margin-top: 10px; max-width: 100%; border-radius: 10px"
        />
      </div>
      <!-- 如果沒有圖片，顯示預設圖片 -->
      <div v-else>
        <img
          src="@/assets/default-image.jpg"
          alt="預設圖片"
          style="margin-top: 10px; max-width: 100%; border-radius: 10px"
        />
      </div>

      <p v-if="place.rating">
        ⭐ {{ place.rating }}（共 {{ place.user_ratings_total }} 則評價）
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const mapRef = ref(null);
const searchQuery = ref("");
const searchInput = ref(null);
const isToggled = ref(false);
const placeDetails = ref([]);

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
    location: map.getCenter(),
    radius: 5000, 
  };

  service.textSearch(request, (results, status) => {
    if (status === google.maps.places.PlacesServiceStatus.OK && results) {
      markers.forEach((marker) => marker.setMap(null));
      markers = [];
      placeDetails.value = [
        //測試：如果沒有圖片
        // {
        //   name: "測試地點",
        //   formatted_address: "測試地址",
        //   photos: [], // 模擬沒有圖片的情況
        //   rating: 4.5,
        //   user_ratings_total: 100,
        // },
      ];

      const bounds = new google.maps.LatLngBounds();

      results.forEach((place) => {
        if (!place.geometry || !place.geometry.location) return;

        bounds.extend(place.geometry.location);

        const marker = new google.maps.Marker({
          map,
          position: place.geometry.location,
          title: place.name,
        });

        markers.push(marker);

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
            placeDetails.value.push(detailResult);
          } else {
            console.warn("取得詳細資料失敗：", detailStatus);
          }
        });
      });

      map.fitBounds(bounds);
    } else {
      placeDetails.value = [];
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
.search-wrapper {
  position: relative;
  width: 300px;
}

.search-input {
  color: white;
  padding: 8px 40px 8px 12px; /* 預留右側空間放按鈕 */
  width: 100%;
  border-radius: 30px;
  border: none;
  font-size: 16px;
  background-color: rgba(129, 129, 129, 0.7);
  box-sizing: border-box;
}

.search-input::placeholder {
  color: white;
}

.search-btn {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
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
  content: "卡片";
}
.info-panel {
  position: absolute;
  top: 80px;
  left: 0;
  z-index: 1000;
  background: white;
  width: 100vw;
  max-height: 90vh;
  padding: 10px;
  box-sizing: border-box;
  display: grid;
  grid-template-columns: repeat(5, 1fr); /* 強制 5 欄 */
  gap: 10px;
  overflow-y: auto; /* 垂直可捲動 */
  overflow-x: hidden; /* 禁止橫向捲動 */
}
.place-card {
  background-color: #e2e2e2;
  border-radius: 12px;
  padding: 12px;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.1);
  min-width: 0;
  max-width: 100%;
  overflow: hidden;
}
.place-card img {
  max-width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  border-radius: 10px;
  margin-top: 10px;
}
.place-card h2 {
  width: 100%;
  font-size: 24px;
  font-weight: bold;
  white-space: nowrap; /* 不換行 */
  overflow: hidden; /* 超出隱藏 */
  text-overflow: ellipsis; /* 顯示 ... */
  margin-bottom: 8px;
}
.place-card p {
  width: 100%;
  font-size: 16px;
  white-space: nowrap; /* 不換行 */
  overflow: hidden; /* 超出隱藏 */
  text-overflow: ellipsis; /* 顯示 ... */
  margin-bottom: 8px;
}
@media (max-width: 1200px) {
  .info-panel {
    grid-template-columns: repeat(4, 1fr);
  }
}
@media (max-width: 900px) {
  .info-panel {
    grid-template-columns: repeat(3, 1fr);
  }
}
@media (max-width: 600px) {
  .info-panel {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>

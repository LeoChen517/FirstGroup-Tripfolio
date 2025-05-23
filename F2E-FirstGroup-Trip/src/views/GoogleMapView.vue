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
          :src="
            place.photos && place.photos.length
              ? place.photos[0].getUrl({ maxWidth: 400 })
              : defaultImage
          "
          @error="(e) => (e.target.src = defaultImage)"
          alt="地點圖片"
          style="margin-top: 10px; max-width: 100%; border-radius: 10px"
        />
      </div>
      <!-- 如果沒有圖片，顯示預設圖片 -->
      <div v-else>
        <img
          :src="defaultImage"
          alt="預設圖片"
          style="margin-top: 10px; max-width: 100%; border-radius: 10px"
        />
      </div>

      <p v-if="place.rating">
        ⭐ {{ place.rating }}（共 {{ place.user_ratings_total }} 則評價）
      </p>
    </div>
    <div v-if="hasMoreResults" class="load-more-container">
      <button class="load-more-btn" @click="loadNextPage">🔄 載入更多</button>
    </div>
  </div>
  <h1 class="text-3xl font-bold underline">Hello world!</h1>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { Loader } from "@googlemaps/js-api-loader";

const mapRef = ref(null);
const searchQuery = ref("");
const isToggled = ref(false);
const placeDetails = ref([]);
const nextPageFunc = ref(null); // 儲存下一頁函式
const hasMoreResults = ref(false); // 控制是否顯示按鈕
const defaultImage = "https://picsum.photos/600?image";

let map = null;
let markers = [];
let service = null;

function loadGoogleMaps() {
  return new Promise((resolve, reject) => {
    // 如果已經有 google maps 就直接 resolve
    if (window.google && window.google.maps && window.google.maps.places) {
      resolve();
      return;
    }

    const loader = new Loader({
      apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
      version: "weekly",
      libraries: ["places"],
    });

    loader
      .load()
      .then(() => {
        if (window.google && window.google.maps.places) {
          resolve("載入成功places_api");
        } else {
          reject(new Error("Places library 沒載入成功"));
        }
      })
      .catch((err) => {
        console.error("Google Maps 載入失敗", err);
        reject(err);
      });
  });
}

// 初始化地圖
function initMap() {
  map = new google.maps.Map(mapRef.value, {
    center: { lat: 25.033964, lng: 121.564472 },
    zoom: 15,
    mapTypeControl: false,
    zoomControl: false,
    streetViewControl: false,
  });
  service = new google.maps.places.PlacesService(map);
}

function searchPlace() {
  if (!searchQuery.value || !map) return;

  // 清除上次資料
  markers.forEach((marker) => marker.setMap(null));
  markers = [];
  placeDetails.value = [];
  nextPageFunc.value = null;
  hasMoreResults.value = false;

  const request = {
    location: map.getCenter(), // 使用地圖中心點作為搜尋基準
    radius: 5000, // 半徑設為 5000 米 (5 公里)
    keyword: searchQuery.value, // 使用關鍵字來篩選結果
  };

  service.nearbySearch(request, handleResults);
}

function handleResults(results, status, pagination) {
  if (status !== google.maps.places.PlacesServiceStatus.OK || !results.length) {
    alert("找不到地點！");
    return;
  }

  // 不清除舊的標記和資料，繼續顯示新的資料
  results.forEach((place) => {
    if (!place.geometry || !place.geometry.location) return;

    // 在這裡將地圖中心設置為搜尋結果的第一個地點
    map.setCenter(place.geometry.location); // 設定地圖的中心位置

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
        placeDetails.value.push(detailResult); // 不清空，直接新增結果
      }
    });
  });

  // 分頁處理
  if (pagination && pagination.hasNextPage) {
    nextPageFunc.value = () => pagination.nextPage();
    hasMoreResults.value = true;
  } else {
    hasMoreResults.value = false;
  }
}

function loadNextPage() {
  if (nextPageFunc.value) {
    nextPageFunc.value(); // Google 會自動再次調用 handleResults
  }
}

onMounted(async () => {
  try {
    const message = await loadGoogleMaps(); // 接住 resolve 傳回來的訊息
    console.log("✅", message); // 顯示「載入成功」
    initMap();
  } catch (err) {
    alert("❌ Google Maps 載入失敗");
    console.error(err);
  }
});
</script>

<style scoped>
* {
  font-family: "Noto Sans TC", sans-serif;
}
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
  content: "地圖";
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
  padding: 10px;
  box-sizing: border-box;
  display: grid;
  max-width: 100%;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 10px;
  overflow-y: auto;
}
.place-card {
  background-color: #e2e2e2;
  border-radius: 12px;
  padding: 12px;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.1);
  min-width: 0;
  max-width: 100%;
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
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 8px;
}
.place-card p {
  width: 100%;
  font-size: 16px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 8px;
}
.load-more-container {
  grid-column: 1 / -1;
  text-align: center;
  margin-top: 10px;
}

.load-more-btn {
  background-color: #8f8f8f;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 16px;
  width: 50%;
}
.load-more-btn:hover {
  background-color: #3a3a3a;
}
</style>

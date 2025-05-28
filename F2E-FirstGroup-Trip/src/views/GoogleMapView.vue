<template>
  <div
    class="absolute top-2.5 left-1/2 -translate-x-1/2 z-[999] flex items-center gap-2.5 bg-gray-400/90 px-2.5 py-2.5 rounded-full"
  >
    <div class="relative w-[300px]">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white pointer-events-none"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
        />
      </svg>
      <input
        type="text"
        v-model="searchQuery"
        placeholder="輸入地點"
        class="w-full rounded-full border-none text-white bg-gray-600/70 px-10 py-2.5 box-border text-base placeholder-white"
        ref="searchInput"
        @keyup.enter="searchPlace"
      />
      <button
        @click.prevent="searchPlace"
        class="absolute right-1.5 top-1/2 -translate-y-1/2 bg-gray-400 px-2.5 py-1.5 rounded-full border-none cursor-pointer text-xs text-white"
      >
        搜尋
      </button>
    </div>
    <!-- Toggle switch -->
    <label class="relative inline-block w-20 h-8.5">
      <input type="checkbox" v-model="isToggled" class="opacity-0 w-0 h-0" />
      <span
        class="absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-gray-300 transition duration-300 rounded-full"
      >
        <span
          class="absolute h-6 w-10 left-1.5 bottom-1.5 bg-white rounded-full flex items-center justify-center text-xs font-bold text-black transition duration-300"
          :class="{ 'translate-x-7': isToggled }"
          :style="{ content: isToggled ? `'卡片'` : `'地圖'` }"
        >
          {{ isToggled ? "卡片" : "地圖" }}
        </span>
      </span>
    </label>
  </div>
  <div v-show="!isToggled" ref="mapRef" class="w-screen h-screen m-0 p-0"></div>
  <div
    v-show="isToggled"
    v-if="placeDetails.length"
    class="absolute top-20 left-0 z-[1000] bg-white p-2.5 box-border grid max-w-full grid-cols-[repeat(auto-fill,minmax(250px,max-content))] justify-start gap-2.5 overflow-y-auto"
  >
    <div
      v-for="(place, index) in placeDetails"
      :key="index"
      @click="selectedPlace = place"
      class="bg-gray-300 rounded-lg p-3 shadow-sm min-w-0 max-w-full hover:bg-slate-400 cursor-pointer transition duration-300"
    >
      <h2
        :title="place.name"
        class="w-full text-xl font-bold whitespace-nowrap overflow-hidden text-ellipsis mb-2"
      >
        {{ place.name }}
      </h2>

      <img
        :src="
          place.photos && place.photos.length
            ? place.photos[0].getUrl({ maxWidth: 1000 })
            : defaultImage
        "
        @error="(e) => (e.target.src = defaultImage)"
        alt="地點圖片"
        class="max-w-full aspect-[4/3] object-cover rounded-lg mt-2.5"
      />
    </div>

    <div v-if="hasMoreResults" class="col-span-full text-center mt-2.5">
      <button
        class="bg-gray-500 text-white py-2.5 px-5 rounded-full cursor-pointer text-lg w-1/2 hover:bg-gray-800"
        @click="loadNextPage"
      >
        🔄 載入更多
      </button>
    </div>
  </div>
  <!--地點詳細資訊 -->
  <div
    v-if="selectedPlace"
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]"
    @click.self="selectedPlace = null"
  >
    <div class="bg-white rounded-lg p-6 w-full max-w-md relative">
      <!-- <button
        class="absolute top-6 right-5 hover:cursor-pointer text-yellow-600 text-2xl"
        @click="selectedPlace = null"
      >
        ✖︎
      </button> -->
      <h2 class="text-2xl font-bold mb-3">{{ selectedPlace.name }}</h2>
      <p class="text-gray-600 text-sm mb-3">
        {{ selectedPlace.formatted_address }}
      </p>
      <p v-if="selectedPlace.rating" class="text-yellow-600 mb-3">
        ⭐ {{ selectedPlace.rating }}（共
        {{ selectedPlace.user_ratings_total }} 則評價）
      </p>
      <div class="relative w-full aspect-[4/3]">
        <button
          v-if="selectedPlace.photos && selectedPlace.photos.length > 1"
          @click.stop="
            selectedPlacePhotoIndex =
              (selectedPlacePhotoIndex - 1 + selectedPlace.photos.length) %
              selectedPlace.photos.length
          "
          class="absolute top-1/2 left-2 -translate-y-1/2 bg-black bg-opacity-40 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-700"
          aria-label="上一張圖片"
        >
          ‹
        </button>

        <!-- 圖片 -->
        <img
          :src="
            selectedPlace.photos && selectedPlace.photos.length
              ? selectedPlace.photos[selectedPlacePhotoIndex].getUrl({
                  maxWidth: 800,
                })
              : defaultImage
          "
          @error="(e) => (e.target.src = defaultImage)"
          alt="地點圖片"
          class="max-w-full aspect-[4/3] object-cover rounded-lg mt-2.5"
        />
        <button
          v-if="selectedPlace.photos && selectedPlace.photos.length > 1"
          @click.stop="
            selectedPlacePhotoIndex =
              (selectedPlacePhotoIndex + 1) % selectedPlace.photos.length
          "
          class="absolute top-1/2 right-2 -translate-y-1/2 bg-black bg-opacity-40 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-700"
          aria-label="下一張圖片"
        >
          ›
        </button>
      </div>
    </div>
  </div>
  <div class="controls">
    <div v-if="result">
      <p>兩點距離：{{ result.distance }}，預估時間：{{ result.duration }}</p>
    </div>
    <label
      >選擇交通方式：
      <select v-model="travelMode" @change="recalculateRoute">
        <option value="DRIVING">🚗 開車</option>
        <option value="WALKING">🚶‍♀️ 步行</option>
        <option value="TRANSIT">🚇 大眾運輸</option>
      </select>
    </label>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";

// 地圖與搜尋
const mapRef = ref(null);              // 地圖容器 (initMap)
const searchQuery = ref("");           // 搜尋關鍵字 (searchPlace)
const isToggled = ref(false);          // 切換地圖 / 卡片視圖

// 地點資料
const placeDetails = ref([]);          // 搜尋結果詳細資訊 (searchPlace, handleResults)
const nextPageFunc = ref(null);        // 分頁函式 (handleResults, loadNextPage)
const hasMoreResults = ref(false);     // 是否有更多結果 (searchPlace, handleResults)
const defaultImage = "https://picsum.photos/1000?image";

// 選擇的地點與圖片
const selectedPlace = ref(null);       // 使用者選擇的地點 (點擊 marker 或卡片)
const selectedPlacePhotoIndex = ref(0);// 當前顯示的圖片索引 (watch selectedPlace)

// 路線規劃
const travelMode = ref("DRIVING");     // 交通方式 (select dropdown)
const result = ref(null);              // 路線結果（距離與時間）(calculateRoute)

// Google Maps 實例與服務
let map = null;                        // 地圖實例 (initMap)
let markers = [];                      // 所有標記 (searchPlace, 點擊地圖)
let service = null;                    // 地點服務 (initMap)
let directionsService;                 // 路線服務 (onMounted)
let directionsRenderer;                // 路線顯示器 (onMounted)


//當 selectedPlace 改變時，重設圖片索引
watch(selectedPlace, (newVal) => {
  if (newVal) {
    selectedPlacePhotoIndex.value = 0;
  }
});

// 載入 Google Maps API
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
// 初始化地圖
function initMap() {
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
    },
  });
  service = new google.maps.places.PlacesService(map);
}
// 搜尋地點
function searchPlace() {
  if (!searchQuery.value || !map) return;

  markers.forEach((marker) => marker.setMap(null));
  markers = [];
  placeDetails.value = [];
  nextPageFunc.value = null;
  hasMoreResults.value = false;

  const request = {
    location: map.getCenter(),
    radius: 5000,
    keyword: searchQuery.value,
  };
  service.nearbySearch(request, handleResults);
}
// 處理搜尋結果
function handleResults(results, status, pagination) {
  if (status !== google.maps.places.PlacesServiceStatus.OK || !results.length) {
    alert("找不到地點！");
    return;
  }
  results.forEach((place) => {
    if (!place.geometry || !place.geometry.location) return;

    map.setCenter(place.geometry.location);

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
        "geometry",
        // "types",
        "rating",
        "user_ratings_total",
        // "formatted_phone_number",
        // "international_phone_number",
        // "opening_hours",
        // "current_opening_hours",
        // "secondary_opening_hours",
        "photos",
        // "reviews",
        // "price_level",
        // "website",
        // "url", //開啟 Google 地圖
        // "vicinity", //附近描述（適用於搜尋 API，如 "near Taipei 101"）
        // "address_components",
        // "adr_address",
        // "postal_address",
        // "short_formatted_address",
        "business_status",
        "icon", // =icon_mask_base_uri + icon_background_color
        // 其他field欄位參考：https://developers.google.com/maps/documentation/places/web-service/legacy/details?hl=zh-tw#fields
      ],
    };

    service.getDetails(detailRequest, (detailResult, detailStatus) => {
      if (detailStatus === google.maps.places.PlacesServiceStatus.OK) {
        placeDetails.value.push(detailResult);

        marker.addListener("click", () => {
          selectedPlace.value = detailResult;
        });
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
// 載入下一頁
function loadNextPage() {
  if (nextPageFunc.value) {
    nextPageFunc.value();
  }
}
// 計算路線
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
// 重設地圖和標記
function reset() {
  result.value = null;
  markers.forEach((marker) => marker.setMap(null));
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
onMounted(async () => {
  try {
    await loadGoogleMaps(); // 等待 API 載入
    initMap(); // 初始化地圖

    // 初始化方向服務
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer({
      suppressMarkers: true,
    });
    directionsRenderer.setMap(map);

    // 設置地圖點擊事件
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
  } catch (err) {
    alert("❌ Google Maps 載入失敗");
    console.error(err);
  }
});
</script>

<style scoped>
.controls {
  position: absolute;
  bottom: 40px;
  left: 20px;
  background: rgba(255, 255, 255, 0.9);
  padding: 8px 12px;
  border-radius: 6px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  display: flex;
  gap: 10px;
  align-items: center;
  z-index: 1;
}
</style>

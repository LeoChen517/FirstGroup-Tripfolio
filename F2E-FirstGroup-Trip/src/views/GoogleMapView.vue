<template>
  <div class="absolute top-2.5 left-1/2 -translate-x-1/2 z-[999] flex items-center gap-2.5 bg-gray-400/90 px-2.5 py-2.5 rounded-full">
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
      <button @click.prevent="searchPlace"
        class="absolute right-1.5 top-1/2 -translate-y-1/2 bg-gray-400 px-2.5 py-1.5 rounded-full border-none cursor-pointer text-xs text-white">
        搜尋
      </button>
    </div>

    <!-- Toggle switch -->
    <label class="relative inline-block w-20 h-8.5">
      <input type="checkbox" v-model="isToggled" class="opacity-0 w-0 h-0" />
      <span class="absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-gray-300 transition duration-300 rounded-full">
        <span class="absolute h-6 w-10 left-1.5 bottom-1.5 bg-white rounded-full flex items-center justify-center text-xs font-bold text-black transition duration-300"
              :class="{ 'translate-x-7': isToggled }"
              :style="{ content: isToggled ? `'卡片'` : `'地圖'` }"
        >
          {{ isToggled ? '卡片' : '地圖' }}
        </span>
      </span>
    </label>
  </div>

  <div v-show="!isToggled" ref="mapRef" class="w-screen h-screen m-0 p-0"></div>

  <div v-show="isToggled" v-if="placeDetails.length" class="absolute top-20 left-0 z-[1000] bg-white p-2.5 box-border grid max-w-full grid-cols-[repeat(auto-fill,minmax(250px,max-content))] justify-start gap-2.5 overflow-y-auto">
    <div v-for="(place, index) in placeDetails" :key="index" class="bg-gray-300 rounded-lg p-3 shadow-sm min-w-0 max-w-full">
      <h2 :title="place.name" class="w-full text-xl font-bold whitespace-nowrap overflow-hidden text-ellipsis mb-2">{{ place.name }}</h2>
      <p :title="place.formatted_address" class="w-full text-sm whitespace-nowrap overflow-hidden text-ellipsis mb-2">{{ place.formatted_address }}</p>
      <p v-if="place.rating">⭐ {{ place.rating }}（共 {{ place.user_ratings_total }} 則評價）</p>
      <img
        :src="place.photos && place.photos.length ? place.photos[0].getUrl({ maxWidth: 1000 }) : defaultImage"
        @error="(e) => (e.target.src = defaultImage)"
        alt="地點圖片"
        class="max-w-full aspect-[4/3] object-cover rounded-lg mt-2.5"
      />
    </div>

    <div v-if="hasMoreResults" class="col-span-full text-center mt-2.5">
      <button class="bg-gray-500 text-white py-2.5 px-5 rounded-full cursor-pointer text-lg w-1/2 hover:bg-gray-800" @click="loadNextPage">
        🔄 載入更多
      </button>
    </div>
  </div>
</template>

<script setup >
import { ref, onMounted } from "vue";

const mapRef = ref(null);
const searchQuery = ref("");
const isToggled = ref(false);
const placeDetails = ref([]);
const nextPageFunc = ref(null);
const hasMoreResults = ref(false);
const defaultImage = "https://picsum.photos/1000?image";

let map = null;
let markers = [];
let service = null;

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
        // "user_ratings_total",
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
        // "plus_code",
        // "editorial_summary",
        "icon", // =icon_mask_base_uri + icon_background_color
        // "icon_background_color",
        // "icon_mask_base_uri",
        // "utc_offset", // 當地時間與 UTC 的時差（分鐘）
        // "curbside_pickup", // 是否提供路邊取貨
        // "delivery", // 是否提供外送
        // "dine_in", // 是否提供內用
        // "takeout", // 是否提供外帶
        // "reservable", // 是否可預約
        // "serves_beer", // 是否供應啤酒
        // "serves_breakfast", // 是否供應早餐
        // "serves_brunch", // 是否供應早午餐
        // "serves_dinner", // 是否供應晚餐
        // "serves_lunch", // 是否供應午餐
        // "serves_vegetarian_food", // 是否供應素食
        // "serves_wine", // 是否供應葡萄酒
        // "good_for_children", // 是否適合兒童
        // "good_for_groups", // 是否適合團體聚會
        // "live_music", // 是否有現場音樂
        // "menu_for_children", // 是否有兒童菜單
        // "outdoor_seating", // 是否有戶外座位
        // "restroom", // 是否有洗手間
        // "parking_options", // 停車選項資訊（例如是否提供停車場、代客泊車等）
        // "payment_options", // 支付方式資訊（如信用卡、行動支付等）
        // "google_maps_links", // 指向 Google 地圖的頁面連結（URL）
        // "google_maps_uri", // Google Maps 的深層連結 URI（通常用於行動裝置跳轉）
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
// 載入下一頁
function loadNextPage() {
  if (nextPageFunc.value) {
    nextPageFunc.value();
  }
}

onMounted(async () => {
  try {
    await loadGoogleMaps();
    initMap();
  } catch (err) {
    alert("❌ Google Maps 載入失敗");
    console.error(err);
  }
  // 檢視卡片頁面樣式
  // placeDetails.value = [
  //   {
  //     name: "星巴克台北101店",
  //     formatted_address: "台北市信義區信義路五段7號",
  //     photos: [
  //       {
  //         getUrl: ({ maxWidth }) => `https://picsum.photos/${maxWidth}/600?random=1`,
  //       },
  //     ],
  //     rating: 4.3,
  //     user_ratings_total: 152,
  //   }
  // ];
});
</script>

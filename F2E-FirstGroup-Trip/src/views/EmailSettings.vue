<template>
  <div class="p-4 max-w-xl mx-auto">
    <h2 class="text-xl font-bold mb-4">Email 通知設定</h2>
    <div v-if="loading">載入中...</div>
    <div v-else>
      <div
        v-for="(value, key) in preferences"
        :key="key"
        class="flex items-center justify-between py-2 border-b"
      >
        <span>{{ labels[key] }}</span>
        <input type="checkbox" v-model="preferences[key]" />
      </div>
      <button
        @click="savePreferences"
        class="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        儲存設定
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const preferences = ref({
  register_success: true,
  login_success: true,
  abnormal_login: true,
  email_verification: true,
  post_commented: true,
  post_liked: true,
  post_saved: true,
  post_shared: true,
  customer_service_reply: true,
});

const labels = {
  register_success: "註冊成功",
  login_success: "登入成功",
  abnormal_login: "帳號登入異常",
  email_verification: "信箱驗證提醒",
  post_commented: "貼文被留言",
  post_liked: "貼文被按讚",
  post_saved: "貼文被收藏",
  post_shared: "貼文被分享",
  customer_service_reply: "客服回覆",
};

const loading = ref(true);

const fetchPreferences = async () => {
  try {
    const token = localStorage.getItem("token");
    const { data } = await axios.get(
      "http://localhost:3000/api/email-preferences",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    preferences.value = data;
  } catch (err) {
    console.error("載入偏好設定失敗", err);
  } finally {
    loading.value = false;
  }
};

const savePreferences = async () => {
  try {
    const token = localStorage.getItem("token");
    await axios.put(
      "http://localhost:3000/api/email-preferences",
      { preferences: preferences.value },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    alert("偏好設定已更新！");
  } catch (err) {
    console.error("更新失敗", err);
    alert("儲存失敗，請稍後再試。");
  }
};

onMounted(() => {
  fetchPreferences();
});
</script>

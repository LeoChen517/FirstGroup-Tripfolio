<template>
  <div>
    <h2>Email 通知設定</h2>
    <div v-for="(value, key) in settings" :key="key">
      <label>
        <input type="checkbox" v-model="settings[key]" />
        {{ getLabel(key) }}
      </label>
    </div>
    <button @click="save">儲存設定</button>
  </div>
</template>

<script setup>
import { useNotificationStore } from "@/stores/notificationStore";
import { onMounted } from "vue";

const store = useNotificationStore();
const settings = store.settings;

onMounted(async () => {
  await store.fetchSettings();
});

const save = async () => {
  await store.updateSettings();
  alert("已儲存！");
};

const getLabel = (key) => {
  const labels = {
    onRegister: "註冊成功",
    onLogin: "登入成功",
    onAbnormalLogin: "帳號登入異常",
    onEmailVerify: "信箱驗證提醒",
    onComment: "貼文被留言",
    onLike: "貼文被按讚",
    onFavorite: "貼文被收藏",
    onShare: "貼文被分享",
    onCustomerReply: "客服回覆",
  };
  return labels[key] || key;
};
</script>

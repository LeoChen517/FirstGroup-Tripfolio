import { defineStore } from "pinia";
import axios from "axios";

export const useNotificationStore = defineStore("notification", {
  state: () => ({
    settings: {},
  }),
  actions: {
    async fetchSettings() {
      const res = await axios.get("/api/notification-settings");
      this.settings = res.data;
    },
    async updateSettings() {
      await axios.put("/api/notification-settings", this.settings);
    },
  },
});

import { createRouter, createWebHistory } from "vue-router";
import EmailSettings from "@/views/EmailSettings.vue";

const routes = [
  {
    path: "/EmailSettings",
    name: "EmailSettings",
    component: EmailSettings,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

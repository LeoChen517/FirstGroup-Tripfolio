import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import GoogleMapView from "@/views/GoogleMapView.vue";
import App from "@/App.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: App,
  },
  {
    path: "/map",
    name: "map",
    component: GoogleMapView,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;

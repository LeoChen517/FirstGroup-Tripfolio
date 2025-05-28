import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import GoogleMapView from "@/views/GoogleMapView.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
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

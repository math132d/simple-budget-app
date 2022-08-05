import { createApp } from "vue";
import "./main.css";
import App from "./App.vue";

import { createRouter, createWebHistory } from "vue-router";

import routes from "./routes";
import { getDatabase, readTransaction } from "./services/database";

const router = createRouter({
  history: createWebHistory(),
  routes,
});

createApp(App).use(router).mount("#app");

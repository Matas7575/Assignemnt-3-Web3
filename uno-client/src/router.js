import { createRouter, createWebHistory } from "vue-router";
import Home from "./components/Home.vue";
import Register from "./components/Register.vue";
import Login from "./components/Login.vue";
import GameSetup from "./components/GameSetup.vue";
import GamePlay from "./components/GamePlay.vue";
import GameOver from "./components/GameOver.vue";

const routes = [
  { path: "/", component: Home },
  { path: "/register", component: Register },
  { path: "/login", component: Login },
  { path: "/game-setup", component: GameSetup },
  { path: "/game/:gameId", component: GamePlay, props: true },
  { path: "/game/:gameId/over", component: GameOver, props: true },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

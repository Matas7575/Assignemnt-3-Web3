import { createRouter, createWebHistory } from "vue-router";
import Home from "./components/Home.vue";
import Register from "./components/Register.vue";
import Login from "./components/Login.vue";
import GameSetup from "./components/GameSetup.vue";
import GamePlay from "./components/GamePlay.vue";
import GameOver from "./components/GameOver.vue";

// Define the routes for the application
const routes = [
  { path: "/", component: Home }, // Home route
  { path: "/register", component: Register }, // Registration route
  { path: "/login", component: Login }, // Login route
  { path: "/game-setup", component: GameSetup }, // Game setup route
  { path: "/game/:gameId", component: GamePlay, props: true }, // Game play route with gameId as a prop
  { path: "/game/:gameId/over", component: GameOver, props: true }, // Game over route with gameId as a prop
];

// Create the router instance with history mode and the defined routes
const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Export the router instance to be used in the Vue application
export default router;
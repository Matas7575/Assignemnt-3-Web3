import { createApp } from "vue";
import App from "./App.vue";
import io from "socket.io-client";
import router from "./router";

// Establish a socket connection to the server
const socket = io("http://localhost:3000");

// Create the Vue application instance
const app = createApp(App);

// Use the router instance in the Vue application
app.use(router);

// Make the socket instance globally available in the Vue application
app.config.globalProperties.$socket = socket;

// Mount the Vue application to the DOM element with the id "app"
app.mount("#app");
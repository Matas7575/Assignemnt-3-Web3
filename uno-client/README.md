# uno-client

This project is a client-side application for an Uno game built with Vue.js. It connects to a server to manage game state and player interactions in real-time using Socket.io.

## Project setup

### Install dependencies

Navigate to the `uno-client` directory and install the necessary dependencies:

```bash
cd uno-client
npm install
```

### Compiles and hot-reloads for development

To start the development server with hot-reloading, use the following command:

```bash
npm run serve
```

### Compiles and minifies for production

To build the project for production, use the following command:

```bash
npm run build
```

### Lints and fixes files

To lint and fix files, use the following command:

```bash
npm run lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

## Running the Server

Navigate to the `uno-game-3` directory and install the necessary dependencies:

```bash
cd ../uno-game-3
npm install
```

Ensure that MongoDB is running on `mongodb://127.0.0.1:27017/uno_game` and start the server with the following command:

```bash
node server.js
```

## Technical Decisions

### Vue.js

The application is built using Vue.js, a progressive JavaScript framework for building user interfaces. Vue.js was chosen for its simplicity and ease of integration with other libraries.

### Socket.io

Socket.io is used for real-time communication between the client and the server. This allows for instant updates to the game state and player interactions. The client establishes a socket connection to the server at `http://localhost:3000`.

### Axios

Axios is used for making HTTP requests to the server's REST API endpoints. This is used for actions such as user authentication and game setup.

### Connection from Client to Server

The client connects to the server using Socket.io for real-time updates and Axios for HTTP requests. Here is a brief overview of how the connection is established and used:

1. **Socket Connection**: In `main.js`, a socket connection is established to the server.

    ```javascript
    // filepath: /D:/Users/chrfoyer/uno test/Assignemnt-3-Web3/uno-client/src/main.js
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
    ```

2. **HTTP Requests**: Axios is used to make HTTP requests to the server for user authentication and game setup.

    ```javascript
    // Example of an Axios request in Login.vue
    import axios from "axios";

    export default {
      methods: {
        async login() {
          try {
            const response = await axios.post(
              "http://localhost:3000/api/auth/login",
              {
                username: this.username,
                password: this.password,
              }
            );
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("username", response.data.username);
            this.$router.push("/game-setup");
          } catch (error) {
            alert("Login failed");
          }
        },
      },
    };
    ```

By following these steps, the client can communicate with the server to manage game state and player interactions in real-time.

With these instructions, you should be able to set up and run the Uno game client and server, and understand the technical decisions made in the project.
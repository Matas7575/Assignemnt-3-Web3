<template>
  <div id="app">
    <header>
      <h1>Uno Game</h1>
      <nav>
        <!-- Navigation links to different routes -->
        <router-link to="/">Home</router-link>
        <router-link to="/login">Login</router-link>
        <router-link to="/register">Register</router-link>
        <router-link to="/game-setup">Game Setup</router-link>
      </nav>
      <!-- Display the username if the user is logged in -->
      <div v-if="username" class="username-display">
        Welcome, {{ username }}
      </div>
    </header>
    <main>
      <!-- Router view to display the current route's component -->
      <router-view />
    </main>
  </div>
</template>

<script>
export default {
  name: "App",
  computed: {
    // Computed property to get the username from local storage
    username() {
      return localStorage.getItem("username");
    },
  },
};
</script>

<style>
#app {
  text-align: center;
}

header {
  background-color: #333;
  padding: 10px;
  color: white;
}

header nav a {
  color: white;
  margin: 0 10px;
  text-decoration: none;
}

header nav a.router-link-exact-active {
  font-weight: bold;
}

main {
  padding: 20px;
}

.username-display {
  position: absolute;
  top: 10px;
  right: 10px;
}
</style>
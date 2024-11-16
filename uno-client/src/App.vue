<template>
  <div id="app">
    <header>
      <h1>Uno Game</h1>
      <nav>
        <router-link to="/">Home</router-link>
        <router-link to="/login">Login</router-link>
        <router-link to="/register">Register</router-link>
        <router-link to="/game-setup">Game Setup</router-link>
      </nav>
      <div v-if="username" class="username-display">
        Welcome, {{ username }}
      </div>
    </header>
    <main>
      <router-view />
    </main>
  </div>
</template>

<script>
export default {
  name: "App",
  computed: {
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

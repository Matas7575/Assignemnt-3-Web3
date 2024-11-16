<template>
  <div class="auth-container">
    <h2>Login</h2>
    <form @submit.prevent="login">
      <input v-model="username" placeholder="Username" required />
      <input
        type="password"
        v-model="password"
        placeholder="Password"
        required
      />
      <button type="submit">Login</button>
    </form>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      username: "",
      password: "",
    };
  },
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
        localStorage.setItem("username", response.data.username); // Store username
        this.$router.push("/game-setup");
      } catch (error) {
        alert("Login failed");
      }
    },
  },
};
</script>

<style scoped>
.auth-container {
  max-width: 400px;
  margin: auto;
  padding: 20px;
}
</style>

<template>
  <div class="auth-container">
    <h2>Login</h2>
    <!-- Form to handle user login -->
    <form @submit.prevent="login">
      <!-- Input field for username -->
      <input v-model="username" placeholder="Username" required />
      <!-- Input field for password -->
      <input
        type="password"
        v-model="password"
        placeholder="Password"
        required
      />
      <!-- Submit button for the login form -->
      <button type="submit">Login</button>
    </form>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      // Username entered by the user
      username: "",
      // Password entered by the user
      password: "",
    };
  },
  methods: {
    // Method to handle user login
    async login() {
      try {
        // Send a POST request to the login API
        const response = await axios.post(
          "http://localhost:3000/api/auth/login",
          {
            username: this.username,
            password: this.password,
          }
        );
        // Store the received token and username in local storage
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("username", response.data.username);
        // Redirect to the game setup page
        this.$router.push("/game-setup");
      } catch (error) {
        // Display an alert if login fails
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
<template>
  <div class="auth-container">
    <h2>Register</h2>
    <!-- Form to handle user registration -->
    <form @submit.prevent="register">
      <!-- Input field for username -->
      <input v-model="username" placeholder="Username" required />
      <!-- Input field for password -->
      <input
        type="password"
        v-model="password"
        placeholder="Password"
        required
      />
      <!-- Submit button for the registration form -->
      <button type="submit">Register</button>
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
    // Method to handle user registration
    async register() {
      try {
        // Send a POST request to the registration API
        await axios.post("http://localhost:3000/api/auth/register", {
          username: this.username,
          password: this.password,
        });
        // Display a success message
        alert("Registration successful");
        // Redirect to the login page
        this.$router.push("/login");
      } catch (error) {
        // Display an alert if registration fails
        alert("Registration failed");
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
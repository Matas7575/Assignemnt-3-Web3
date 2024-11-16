<template>
  <div class="auth-container">
    <h2>Register</h2>
    <form @submit.prevent="register">
      <input v-model="username" placeholder="Username" required />
      <input
        type="password"
        v-model="password"
        placeholder="Password"
        required
      />
      <button type="submit">Register</button>
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
    async register() {
      try {
        await axios.post("http://localhost:3000/api/auth/register", {
          username: this.username,
          password: this.password,
        });
        alert("Registration successful");
        this.$router.push("/login");
      } catch (error) {
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

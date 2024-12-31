<template>
  <div class="game-setup">
    <h2>Game Setup</h2>
    <!-- Button to create a new game lobby -->
    <button @click="createLobby">Create New Game</button>
    <!-- Input field to enter an existing lobby code -->
    <input v-model="lobbyCodeInput" placeholder="Enter Lobby Code" />
    <!-- Button to join an existing game lobby -->
    <button @click="joinLobby">Join Game</button>

    <!-- Display lobby code and list of players if a lobby is joined or created -->
    <div v-if="lobbyCode">
      <p>Lobby Code: {{ lobbyCode }}</p>
      <p>Players: {{ players.map((player) => player.name).join(", ") }}</p>
      <!-- Button to start the game if there are at least 2 players -->
      <button v-if="players.length >= 2" @click="startGame">Start Game</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { io } from "socket.io-client";

export default {
  data() {
    return {
      // The code of the current lobby
      lobbyCode: "",
      // The input value for the lobby code
      lobbyCodeInput: "",
      // Array to store the list of players in the lobby
      players: [],
    };
  },
  methods: {
    // Method to create a new game lobby
    async createLobby() {
      const response = await axios.post(
        "http://localhost:3000/api/lobby/create",
        {
          username: localStorage.getItem("username"),
        }
      );
      this.lobbyCode = response.data.lobbyCode;
      this.players = [{ name: localStorage.getItem("username") }];

      // Join the socket room for the lobby
      this.socket.emit(
        "joinGame",
        this.lobbyCode,
        localStorage.getItem("username")
      );
    },
    // Method to join an existing game lobby
    async joinLobby() {
      const response = await axios.post(
        "http://localhost:3000/api/lobby/join",
        {
          lobbyCode: this.lobbyCodeInput,
          username: localStorage.getItem("username"),
        }
      );
      this.lobbyCode = this.lobbyCodeInput;
      this.players = response.data.players;

      // Join the socket room for the lobby
      this.socket.emit(
        "joinGame",
        this.lobbyCode,
        localStorage.getItem("username")
      );
    },
    // Method to start the game
    async startGame() {
      await axios.post("http://localhost:3000/api/lobby/start", {
        lobbyCode: this.lobbyCode,
      });
      // Redirect to the game page
      this.$router.push(`/game/${this.lobbyCode}`);
    },
  },
  mounted() {
    // Establish a socket connection
    this.socket = io("http://localhost:3000");

    // Listen for game state updates
    this.socket.on("gameState", (game) => {
      if (game.isStarted) {
        console.log("Game started. Redirecting to game page.");
        // Redirect all players to the game route
        this.$router.push(`/game/${game.lobbyCode}`);
      } else {
        console.log("Game not started yet.");
      }
    });
    // Listen for player list updates
    this.socket.on("playerListUpdate", (players) => {
      this.players = players;
    });
  },
};
</script>
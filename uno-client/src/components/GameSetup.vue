<template>
  <div class="game-setup">
    <h2>Game Setup</h2>
    <button @click="createLobby">Create New Game</button>
    <input v-model="lobbyCodeInput" placeholder="Enter Lobby Code" />
    <button @click="joinLobby">Join Game</button>

    <div v-if="lobbyCode">
      <p>Lobby Code: {{ lobbyCode }}</p>
      <p>Players: {{ players.map((player) => player.name).join(", ") }}</p>
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
      lobbyCode: "",
      lobbyCodeInput: "",
      players: [],
    };
  },
  methods: {
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
    async startGame() {
      await axios.post("http://localhost:3000/api/lobby/start", {
        lobbyCode: this.lobbyCode,
      });
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
    this.socket.on("playerListUpdate", (players) => {
      this.players = players;
    });
  },
};
</script>

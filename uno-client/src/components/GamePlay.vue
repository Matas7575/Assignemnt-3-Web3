<template>
  <div v-if="gameOver">
    <!-- Display Game Over message and winner -->
    <h2>Game Over! Winner: {{ winner }}</h2>
    <!-- Button to restart the game -->
    <button @click="restartGame">Restart Game</button>
  </div>
  <div v-else id="play-hand">
    <!-- Display current player's turn -->
    <h2 v-if="players.length">
      Current Turn: {{ players[currentTurn]?.name }}
    </h2>

    <!-- Display current player's hand if it's their turn -->
    <div v-if="players.length && currentPlayerIndex === currentTurn">
      <h3>Your Hand</h3>
      <div class="hand">
        <button
          v-for="(card, index) in players[currentPlayerIndex]?.hand"
          :key="index"
          @click="playCard(index)"
        >
          {{ card }}
        </button>
      </div>
      <!-- Button to draw a card if no playable cards are available -->
      <button v-if="!canPlay()" @click="drawCard">Draw Card</button>
    </div>

    <!-- Display waiting message for other players' turn -->
    <div v-else-if="players.length">
      <h3>Waiting for {{ players[currentTurn]?.name }} to play...</h3>
    </div>

    <!-- Display the top card of the pile -->
    <h3 v-if="topCard">Top of the Pile: {{ topCard }}</h3>
  </div>
</template>

<script>
import axios from "axios";
import { io } from "socket.io-client";

export default {
  props: ["gameId"],
  data() {
    return {
      socket: null,
      gameId: "game1",
      playerName: localStorage.getItem("username") || "Player",
      players: [],
      currentTurn: 0,
      currentPlayerIndex: 0,
      topCard: "",
      gameOver: false,
      winner: null,
    };
  },
  methods: {
    // Method to join the game using socket.io
    joinGame() {
      this.socket.emit("joinGame", this.gameId, this.playerName);
    },
    // Method to play a card
    playCard(index) {
      if (this.currentPlayerIndex === this.currentTurn) {
        this.socket.emit("playCard", this.gameId, index);
      }
    },
    // Method to draw a card
    drawCard() {
      if (this.currentPlayerIndex === this.currentTurn) {
        this.socket.emit("drawCard", this.gameId);
      }
    },
    // Method to check if the player can play any card
    canPlay() {
      return this.players[this.currentPlayerIndex]?.hand.some((card) =>
        this.canPlayCard(card)
      );
    },
    // Method to check if a specific card can be played
    canPlayCard(card) {
      const [topColor, topNumber] = this.topCard.split(" ");
      const [cardColor, cardNumber] = card.split(" ");
      return topColor === cardColor || topNumber === cardNumber;
    },
    // Method to restart the game
    restartGame() {
      axios
        .post("http://localhost:3000/api/game/restart", {
          lobbyCode: this.gameId,
        })
        .then((response) => {
          console.log(response.data.message);
        })
        .catch((error) => {
          console.error("Error restarting game:", error);
        });
    },
    // Method to reset the game state
    resetGameState() {
      this.players = [];
      this.currentTurn = 0;
      this.currentPlayerIndex = 0;
      this.topCard = "";
      this.gameOver = false;
      this.winner = null;
    },
  },
  mounted() {
    // Initialize socket connection and join the game
    this.socket = io("http://localhost:3000");
    this.joinGame();

    // Listen for game state updates from the server
    this.socket.on("gameState", (game) => {
      this.players = game.players;
      this.topCard = game.topCard;
      this.currentTurn = game.currentTurn;
      this.gameOver = game.gameOver;
      this.winner = game.winner;
      this.currentPlayerIndex = this.players.findIndex(
        (player) => player.name === this.playerName
      );
    });
  },
};
</script>

<style scoped>
.hand {
  display: flex;
  gap: 10px;
}

button {
  padding: 10px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}
</style>
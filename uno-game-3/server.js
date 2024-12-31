const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:8080",
    methods: ["GET", "POST"],
  },
});

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/uno_game");

app.use(express.json());
app.use(cors());

const authRoutes = require("../uno-client/src/routes/auth");
app.use("/api/auth", authRoutes);

const lobbies = {}; // Store lobbies in memory for simplicity
let games = {};

// Create Lobby
app.post("/api/lobby/create", (req, res) => {
  const { username } = req.body;
  const lobbyCode = Math.random().toString(36).substring(2, 7); // Generate a random code
  lobbies[lobbyCode] = { players: [{ name: username }], isStarted: false };
  res.json({ lobbyCode });
});

// Join Lobby
app.post("/api/lobby/join", (req, res) => {
  const { lobbyCode, username } = req.body;
  const lobby = lobbies[lobbyCode];
  if (lobby && lobby.players.length < 4 && !lobby.isStarted) {
    lobby.players.push({ name: username });
    res.json({ message: "Joined successfully", players: lobby.players });
  } else {
    res.status(400).json({ error: "Lobby is full or game has started" });
  }
});

// Start Game
app.post("/api/lobby/start", (req, res) => {
  const { lobbyCode } = req.body;
  const game = lobbies[lobbyCode];

  if (game && game.players.length >= 2) {
    // Initialize game state if it hasn't started
    if (!game.isStarted) {
      game.isStarted = true;
      game.deck = generateDeck();
      game.topCard = game.deck.pop();
      dealHands(game.players, game.deck); // Deal initial hands
    }

    // Emit the game state to all players in the lobby
    io.to(lobbyCode).emit("gameState", { ...game, lobbyCode });
    res.json({ message: "Game started", game });
  } else {
    res.status(400).json({ error: "Not enough players to start the game" });
  }
});

// Handle socket connections
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Handle joining a game
  socket.on("joinGame", (gameId, playerName) => {
    if (!games[gameId]) {
      games[gameId] = {
        players: [],
        deck: generateDeck(),
        topCard: null,
        currentTurn: 0,
        gameOver: false,
        winner: null,
      };
    }

    const game = games[gameId];
    const player = { id: socket.id, name: playerName, hand: [] };
    game.players.push(player);

    if (game.players.length === 2) {
      // Start game with 2 players for simplicity
      game.deck = dealHands(game.players, game.deck);
      game.topCard = game.deck.pop();
    }

    socket.join(gameId);
    io.to(gameId).emit("gameState", game);
    io.to(gameId).emit("playerListUpdate", game.players);
  });

  // Handle playing a card
  socket.on("playCard", (gameId, cardIndex) => {
    const game = games[gameId];
    const player = game.players[game.currentTurn];
    const selectedCard = player.hand[cardIndex];

    if (canPlayCard(selectedCard, game.topCard)) {
      game.topCard = selectedCard;
      player.hand.splice(cardIndex, 1);

      if (player.hand.length === 0) {
        game.gameOver = true;
        game.winner = player.name;
      } else {
        nextTurn(game);
      }

      io.to(gameId).emit("gameState", game);
    }
  });

  // Handle drawing a card
  socket.on("drawCard", (gameId) => {
    const game = games[gameId];
    const player = game.players[game.currentTurn];

    if (game.deck.length === 0) {
      game.deck = generateDeck();
    }

    player.hand.push(game.deck.pop());
    nextTurn(game);

    io.to(gameId).emit("gameState", game);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

// Function to generate a deck of cards
function generateDeck() {
  const colors = ["Red", "Yellow", "Green", "Blue"];
  const numbers = Array.from({ length: 10 }, (_, i) => i);
  let deck = [];

  for (const color of colors) {
    for (const number of numbers) {
      deck.push(`${color} ${number}`);
    }
  }

  return deck.sort(() => Math.random() - 0.5);
}

// Function to deal hands to players
function dealHands(players, deck) {
  for (let i = 0; i < 7; i++) {
    players.forEach((player) => {
      player.hand.push(deck.pop());
    });
  }
  return deck;
}

// Function to check if a card can be played
function canPlayCard(card, topCard) {
  const [topColor, topNumber] = topCard.split(" ");
  const [cardColor, cardNumber] = card.split(" ");
  return topColor === cardColor || topNumber === cardNumber;
}

// Function to move to the next turn
function nextTurn(game) {
  game.currentTurn = (game.currentTurn + 1) % game.players.length;
}

// Start the server
server.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
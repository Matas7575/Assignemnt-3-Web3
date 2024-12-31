<template>
  <div class="game-over">
    <!-- Display the Game Over title -->
    <h2>Game Over</h2>
    <!-- Display the winner of the game -->
    <p>Winner: {{ winner }}</p>
    <!-- List of players and their scores -->
    <ul>
      <li v-for="player in scores" :key="player.id">
        {{ player.name }}: {{ player.score }} points
      </li>
    </ul>
    <!-- Button to navigate back to the game setup page -->
    <button @click="$router.push('/game-setup')">Back to Game Setup</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // Array to store the scores of players
      scores: [],
      // String to store the name of the winner
      winner: "",
    };
  },
  async created() {
    // Fetch the game results when the component is created
    const response = await axios.get(
      `http://localhost:3000/api/games/${this.$route.params.gameId}/results`
    );
    // Update the scores and winner with the data from the response
    this.scores = response.data.scores;
    this.winner = response.data.winner;
  },
};
</script>
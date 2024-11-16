<template>
  <div class="game-over">
    <h2>Game Over</h2>
    <p>Winner: {{ winner }}</p>
    <ul>
      <li v-for="player in scores" :key="player.id">
        {{ player.name }}: {{ player.score }} points
      </li>
    </ul>
    <button @click="$router.push('/game-setup')">Back to Game Setup</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      scores: [],
      winner: "",
    };
  },
  async created() {
    const response = await axios.get(
      `http://localhost:3000/api/games/${this.$route.params.gameId}/results`
    );
    this.scores = response.data.scores;
    this.winner = response.data.winner;
  },
};
</script>

<template>
  <div>
    <portal-target name="body-dialog"></portal-target>
    <game-over
      v-if="gameOver"
      @playAgain="playAgain"
      :level="level"
      :clearedLines="clearedLines"
      :score="score"
    ></game-over>
    <start-game v-if="!isGameStart" @gameStart="startGame"></start-game>
    <div
      v-if="isGameStart && !gameOver"
      class="bg-[#000] flex gap-12 font-cursive h-5/6"
    >
      <canvas width="400" height="800" id="game"></canvas>
      <div>
        <score-board
          :level="level"
          :clearedLines="clearedLines"
          :score="score"
          :nextTetromino="nextTetromino"
        ></score-board>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

import ScoreBoard from "~/components/ScoreBoard.vue";
import StartGame from "~/components/StartGame.vue";
import GameOver from "~/components/GameOver.vue";

export default {
  components: {
    ScoreBoard,
    StartGame,
  },
  computed: {
    ...mapState([
      "nextTetromino",
      "score",
      "clearedLines",
      "level",
      "gameOver",
      "isGameStart",
    ]),
  },
  methods: {
    ...mapActions(["playAgain", "animate", "startGame", "moveTetromino"]),
  },
  created() {
    this.$store.dispatch("createPlayfield");
  },
  mounted() {
    document.body.addEventListener("keydown", this.moveTetromino);
  },
  beforeDestroy() {
    document.body.removeEventListener("keydown", this.moveTetromino);
  },
  watch: {
    isGameStart(isStarted) {
      if (isStarted) {
        this.animate();
      }
    },
  },
};
</script>

<style>
#game {
  border: 4px solid #8be8e5;
  animation: shine-border 3s infinite linear;
}

@keyframes shine-border {
  0%,
  100% {
    border-color: #8be8e5;
    box-shadow: none;
  }
  50% {
    border-color: #a084e8;
    box-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
  }
}
</style>

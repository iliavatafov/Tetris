<template>
  <div class="self-start mt-16">
    <h1
      class="text-cyan text-center text-5xl font-bold font-cursive tracking-wider mb-8"
    >
      TOP 10 SCORES
    </h1>
    <div
      class="w-screen flex flex-col items-center font-cursive tracking-wider"
    >
      <div
        class="text-cyan text-2xl bg-opacity-50 h-12 bg-lavender text-lg text-center font-bold flex justify-between items-center w-5/6 max-w-screen-lg"
      >
        <h2 class="w-full">Date</h2>
        <h2 class="w-full">Name</h2>
        <h2 class="w-full">Score</h2>
        <h2 class="w-full">Level</h2>
        <h2 class="w-full">Cleared Lines</h2>
      </div>
      <ul
        v-for="playerData in topTen"
        class="text-cyan border-b-2 border-lavender flex justify-between w-5/6 max-w-screen-lg text-xl"
      >
        <li class="w-full mt-4 pb-3 text-center">{{ playerData.game.date }}</li>
        <li class="w-full mt-4 pb-3 text-center">{{ playerData.name }}</li>
        <li class="w-full mt-4 pb-3 text-center">
          {{ playerData.game.score }}
        </li>
        <li class="w-full mt-4 pb-3 text-center">
          {{ playerData.game.level }}
        </li>
        <li class="w-full mt-4 pb-3 text-center">
          {{ playerData.game.clearedLines }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  data() {
    return {
      topPlayers: null,
    };
  },

  created() {
    this.getTopTen();
    this.cancelAnimation();
    this.playAgain();
  },

  computed: {
    topTen() {
      return this.$store.getters["statistics/topTen"];
    },
  },

  methods: {
    ...mapActions([
      "resetState",
      "cancelAnimation",
      "createPlayfield",
      "playAgain",
    ]),
    async getTopTen() {
      await this.$store.dispatch("statistics/getTopPlayers");
    },
  },
};
</script>

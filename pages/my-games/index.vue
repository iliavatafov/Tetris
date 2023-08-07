<template>
  <div class="self-start mt-16">
    <h1
      class="text-cyan text-center text-5xl font-bold font-cursive tracking-wider mb-8"
    >
      MY TOP 10 SCORES
    </h1>
    <div
      v-if="topTen"
      class="w-screen flex flex-col items-center font-cursive tracking-wider"
    >
      <div
        class="text-cyan text-2xl bg-opacity-50 h-12 bg-lavender text-lg text-center font-bold flex justify-between items-center w-5/6 max-w-screen-lg"
      >
        <h2 class="w-full">Date</h2>
        <h2 class="w-full">Score</h2>
        <h2 class="w-full">Level</h2>
        <h2 class="w-full">Cleared Lines</h2>
      </div>
      <ul
        v-for="game in topTen"
        class="text-cyan border-b-2 border-lavender flex justify-between w-5/6 max-w-screen-lg text-xl"
      >
        <li class="w-full mt-4 pb-3 text-center">{{ game.date }}</li>
        <li class="w-full mt-4 pb-3 text-center">{{ game.score }}</li>
        <li class="w-full mt-4 pb-3 text-center">{{ game.level }}</li>
        <li class="w-full mt-4 pb-3 text-center">{{ game.clearedLines }}</li>
      </ul>
    </div>
    <h2 class="text-cyan font-bold text-2xl font-cursive tracking-wider" v-else>
      You don't have any games played yet
      <nuxt-link class="text-[#489dff] underline hover:text-lavender" to="/"
        >Start your first game</nuxt-link
      >
    </h2>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  middleware: "auth",

  data() {
    return {
      topTen: null,
    };
  },

  async created() {
    const topTen = await this.getTopTen();
    if (topTen) {
      this.topTen = topTen;
    }

    this.cancelAnimation();
    this.playAgain();
  },

  computed: {
    users() {
      return this.$store.getters["statistics/getUsers"];
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
      const userData = await this.$store.dispatch(
        "statistics/getUserData",
        this.$store.getters["auth/userId"]
      );

      if (userData && userData.games) {
        const sortedGames = JSON.parse(JSON.stringify(userData.games)).sort(
          (a, b) => b.score - a.score
        );
        return sortedGames.slice(0, 10);
      } else {
        return null;
      }
    },
  },

  watch: {
    async users(value) {
      if (value) {
        this.topTen = await this.getTopTen();
      }
    },
  },
};
</script>
s

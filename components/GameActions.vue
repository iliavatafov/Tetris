<template>
  <div class="flex gap-4">
    <button
      @click="newGame"
      class="text-cyan text-4xl font-extrabold hover:text-lavender focus:outline-none"
    >
      Start New Game
    </button>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  methods: {
    ...mapActions(["cancelAnimation", "playAgain"]),
    newGame() {
      this.cancelAnimation();
      this.playAgain();
    },
  },
};
</script>

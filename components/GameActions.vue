<template>
  <div class="flex gap-4">
    <button
      @click="newGame"
      class="text-[#8be8e5] text-4xl font-extrabold hover:text-[#a084e8] focus:outline-none"
    >
      Start New Game
    </button>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  methods: {
    ...mapActions([
      "resetState",
      "startGame",
      "createPlayfield",
      "cancelAnimation",
    ]),
    newGame() {
      this.resetState();
      this.cancelAnimation();
      this.createPlayfield();
      this.startGame();
    },
  },
};
</script>

<template>
  <portal to="body-dialog">
    <div
      class="w-screen h-screen bg-black flex items-center justify-center font-cursive"
    >
      <div
        class="text-8xl tracking-wider font-extrabold text-[#999999] flex flex-col items-center justify-center gap-24"
      >
        <div>
          <ul class="flex">
            <li>G</li>
            <li>A</li>
            <li>M</li>
            <li>E</li>
          </ul>
          <ul class="flex">
            <li>O</li>
            <li>V</li>
            <li>E</li>
            <li>R</li>
          </ul>
        </div>
        <div class="flex flex-col items-center justify-center gap-4 w-full">
          <h1 class="text-white text-3xl">Stats</h1>
          <ul
            class="text-black flex flex-col gap-8 items-center justify-center w-full"
          >
            <score-board-item
              class="text-xl"
              title="level"
              :value="level"
            ></score-board-item>
            <score-board-item
              class="text-xl"
              title="lines"
              :value="clearedLines"
            ></score-board-item>
            <score-board-item
              class="text-xl"
              title="score"
              :value="score"
            ></score-board-item>
          </ul>
        </div>

        <button
          @click="play"
          class="text-5xl tracking-wider group font-extrabold animate-pulse transition-all"
        >
          <div>
            <span class="text-[#3877ff] group-hover:text-[#ffe138]">P</span
            ><span class="text-[#ffe138] group-hover:text-[#ff0d72]">L</span
            ><span class="text-[#ff0d72] group-hover:text-[#f538ff]">A</span
            ><span class="text-[#f538ff] group-hover:text-[#3877ff]">Y</span>
          </div>
          <div>
            <span class="text-[#3877ff] group-hover:text-[#ffe138]">A</span
            ><span class="text-[#ffe138] group-hover:text-[#ff0d72]">G</span
            ><span class="text-[#ff0d72] group-hover:text-[#f538ff]">A</span
            ><span class="text-[#f538ff] group-hover:text-[#3877ff]">I</span
            ><span class="text-[#3877ff] group-hover:text-[#ffe138]">N</span>
          </div>
        </button>
      </div>
    </div>
  </portal>
</template>

<script>
import ScoreBoardItem from "~/components/ScoreBoardItem.vue";

export default {
  emits: ["playAgain"],
  components: {
    ScoreBoardItem,
  },
  props: ["level", "clearedLines", "score"],
  methods: {
    play() {
      this.$emit("playAgain");
    },
  },
};
</script>

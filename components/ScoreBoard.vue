<template>
  <div class="flex flex-col gap-8">
    <next-element></next-element>
    <ul class="text-black flex flex-col gap-8">
      <score-board-item title="level" :value="level"></score-board-item>
      <score-board-item title="lines" :value="clearedLines"></score-board-item>
      <score-board-item title="score" :value="score"></score-board-item>
    </ul>
  </div>
</template>

<script>
import ScoreBoardItem from "~/components/ScoreBoardItem.vue";
import NextElement from "~/components/NextElement.vue";

export default {
  props: ["level", "clearedLines", "score"],
  components: {
    ScoreBoardItem,
    NextElement,
  },
};
</script>

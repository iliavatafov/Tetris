<template>
  <div class="bg-black flex items-center justify-center font-cursive">
    <button
      @click="start"
      class="text-8xl tracking-wider group animate-pulse font-extrabold hover:text-9xl transition-all"
    >
      <span class="text-[#3877ff] group-hover:text-[#ffe138]">P</span
      ><span class="text-[#ffe138] group-hover:text-[#ff0d72]">L</span
      ><span class="text-[#ff0d72] group-hover:text-[#f538ff]">A</span
      ><span class="text-[#f538ff] group-hover:text-[#3877ff]">Y</span>
    </button>
  </div>
</template>

<script>
export default {
  emits: ["gameStart"],
  methods: {
    start() {
      this.$emit("gameStart");
    },
  },
};
</script>

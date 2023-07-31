<template>
  <li class="text-6xl text-[#489dff] font-bold">
    {{ title }} <span class="text-[#00DFA2]">{{ value }}</span>
  </li>
</template>

<script>
export default {
  props: ["title", "value"],
};
</script>

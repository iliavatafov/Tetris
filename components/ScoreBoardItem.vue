<template>
  <li class="text-5xl text-[#489dff] font-bold">
    {{ title }} <span class="text-[#a084e8]">{{ value }}</span>
  </li>
</template>

<script>
export default {
  props: ["title", "value"],
};
</script>

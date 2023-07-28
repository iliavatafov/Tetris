<template>
  <li class="text-6xl text-[#489dff] font-bold">
    {{ title }} <span class="text-[#002857]">{{ value }}</span>
  </li>
</template>

<script>
export default {
  props: ["title", "value"],
};
</script>

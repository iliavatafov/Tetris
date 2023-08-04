<template>
  <div
    id="card"
    class="p-4 my-8 mx-auto max-w-2xl default-shadow border border-2 border-[#8be8e5]"
  >
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "BaseCard",
};
</script>

<style>
#card {
  border: 2px solid #8be8e5;
  animation: shine-border 3s infinite linear;
}

@keyframes shine-border {
  0%,
  100% {
    border-color: #8be8e5;
    box-shadow: none;
  }
  50% {
    border-color: #a084e8;
    box-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
  }
}
</style>

<template>
  <div>
    <div class="w-screen h-screen">
      <Header></Header>
      <main class="h-92% flex items-center justify-center">
        <Nuxt />
      </main>
    </div>
  </div>
</template>

<script>
import Header from "~/components/Header.vue";
export default {
  components: {
    Header,
  },
  created() {
    this.$store.dispatch("auth/tryLogin");
  },
};
</script>

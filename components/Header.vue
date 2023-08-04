<template>
  <header id="header" class="h-7% font-cursive">
    <nav class="h-100%">
      <ul
        class="flex items-center h-100% justify-end gap-4 text-[#8be8e5] text-xl font-bold tracking-wider"
      >
        <li class="p-4 text-[#a084e8]">
          {{ userEmail }}
        </li>
        <li class="p-4 cursor-pointer hover:text-[#a084e8] hover:underline">
          <nuxt-link to="/">New Game</nuxt-link>
        </li>
        <li class="p-4 cursor-pointer hover:text-[#a084e8] hover:underline">
          <nuxt-link to="/rank-list"> Rank List</nuxt-link>
        </li>
        <li
          v-if="isAuthenticated"
          class="p-4 cursor-pointer hover:text-[#a084e8] hover:underline"
        >
          <nuxt-link to="/my-games">My Stats</nuxt-link>
        </li>
        <li
          v-if="!isAuthenticated"
          class="p-4 cursor-pointer hover:text-[#a084e8] hover:underline"
        >
          <nuxt-link to="/auth">SignIn</nuxt-link>
        </li>
        <li
          v-if="isAuthenticated"
          @click="logout"
          class="p-4 cursor-pointer hover:text-[#a084e8] hover:underline"
        >
          Logout
        </li>
      </ul>
    </nav>
  </header>
</template>

<script>
export default {
  computed: {
    isAuthenticated() {
      return this.$store.getters["auth/isAuthenticated"];
    },
    userEmail() {
      return this.$store.getters["auth/getUserEmail"];
    },
    userId() {
      return this.$store.getters["auth/userId"];
    },
  },
  methods: {
    logout() {
      this.$store.dispatch("auth/logout");
      const currentPath = this.$router.currentRoute.path;
      if (currentPath !== "/") {
        this.$router.replace("/");
      }
    },
  },
};
</script>

<style>
#header {
  border-bottom: 2px solid #8be8e5;
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

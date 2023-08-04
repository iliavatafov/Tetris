<template>
  <div>
    <base-dialog :show="isLoading" title="Authenticating..." fixed>
      <base-spinner></base-spinner>
    </base-dialog>
    <base-dialog
      :show="error.isError"
      title="An error occured"
      @close="handleError"
    >
      <p>
        {{ error.msg }}
      </p>
    </base-dialog>
    <div class="w-screen h-screen">
      <Header></Header>
      <main class="h-92% flex items-center justify-center">
        <portal-target name="body-dialog"></portal-target>
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
  data() {
    return {
      isLoading: null,
      error: {
        msg: null,
        isError: false,
      },
    };
  },
  async created() {
    this.$store.dispatch("auth/tryLogin");
    this.isLoading = true;

    try {
      await this.$store.dispatch("statistics/getUsers");
    } catch (error) {
      this.error.isError = true;
      this.error.msg = error.message || "Faild to fetch users!";
    }

    this.isLoading = false;
  },
  methods: {
    handleError() {
      this.error = {
        msg: null,
        isError: false,
      };
    },
  },
};
</script>

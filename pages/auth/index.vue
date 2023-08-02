<template>
  <div class="flex items-center justify-center h-3/4">
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

    <base-card class="w-3/4 max-w-lg min-w-max w-screen">
      <form class="p-8 m-4" @submit.prevent="submitForm">
        <div class="my-2">
          <label class="base-label" for="email">E-Mail</label>
          <!-- eslint-disable-next-line vue/max-attributes-per-line -->
          <input
            id="email"
            v-model.trim="email"
            class="base-input"
            type="email"
          />
        </div>
        <div class="my-2">
          <label class="base-label" for="password">Password</label>
          <!-- eslint-disable-next-line vue/max-attributes-per-line -->
          <input
            id="password"
            v-model.trim="password"
            class="base-input"
            type="password"
          />
        </div>
        <p class="validation-messaga" v-if="!formIsValid">
          Please enter valid email and password
        </p>
        <button class="text-xl base-btn mt-4 hover:animate-pulse font-cursive">
          {{ submitButtonCaption }}
        </button>
        <button
          type="button"
          class="tracking-wider font-cursive text-xl text-[#8be8e5] underline py-3 px-6 cursor-pointer inline-block hover:text-[#a084e8]"
          @click="switchAuthMode"
        >
          {{ switchModeButtonCaption }}
        </button>
      </form>
    </base-card>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  middleware: "not-auth",
  data() {
    return {
      email: "",
      password: "",
      formIsValid: true,
      mode: "login",
      isLoading: false,
      error: {
        msg: null,
        isError: false,
      },
    };
  },
  created() {
    this.resetState();
  },
  computed: {
    submitButtonCaption() {
      if (this.mode === "login") {
        return "Login";
      } else {
        return "Signup";
      }
    },
    switchModeButtonCaption() {
      if (this.mode === "login") {
        return "Signup instead";
      } else {
        return "Login instead";
      }
    },
  },
  methods: {
    ...mapActions(["resetState", "cancelAnimation"]),
    async submitForm() {
      this.formIsValid = true;
      if (
        this.email === "" ||
        !this.email.includes("@") ||
        this.password.length < 6
      ) {
        this.formIsValid = false;
        return;
      }

      this.isLoading = true;

      const actionPayload = {
        email: this.email,
        password: this.password,
      };

      try {
        if (this.mode === "login") {
          await this.$store.dispatch("auth/login", actionPayload);
        } else {
          await this.$store.dispatch("auth/signup", actionPayload);
        }
        this.$router.replace("/");
      } catch (error) {
        this.error.isError = true;
        this.error.msg = error.message || "Faild to authenticate, try later.";
      }

      this.isLoading = false;
    },
    switchAuthMode() {
      if (this.mode === "login") {
        this.mode = "signup";
      } else {
        this.mode = "login";
      }
    },
    handleError() {
      this.error = {
        msg: null,
        isError: false,
      };
    },
  },
};
</script>

<style scoped>
.validation-messaga {
  color: #f538ff;
}
</style>

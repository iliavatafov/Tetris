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
        <div v-if="mode !== 'login'" class="my-2">
          <label class="base-label" for="name">Name</label>
          <!-- eslint-disable-next-line vue/max-attributes-per-line -->
          <input id="name" v-model.trim="name" class="base-input" type="text" />
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
        <div v-if="mode !== 'login'" class="my-2">
          <label class="base-label" for="repass">Repear Password</label>
          <!-- eslint-disable-next-line vue/max-attributes-per-line -->
          <input
            id="repass"
            v-model.trim="repass"
            class="base-input"
            type="password"
          />
        </div>
        <p class="validation-messaga" v-if="!formIsValid">
          {{ validationMessage }}
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
      name: "",
      password: "",
      repass: "",
      formIsValid: true,
      validationMessage: "",
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
    this.cancelAnimation();
    this.createPlayfield();
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
    ...mapActions(["resetState", "createPlayfield", "cancelAnimation"]),
    async submitForm() {
      this.formIsValid = true;

      if (this.mode !== "login") {
        if (
          this.email === "" ||
          this.name === "" ||
          this.password === "" ||
          this.repass === ""
        ) {
          this.formIsValid = false;
          this.validationMessage = "All fields are required";
          return;
        }
        if (this.password !== this.repass) {
          this.formIsValid = false;
          this.validationMessage = "Password don`t match";
          return;
        }
      }

      if (this.email === "" || this.password.length < 6) {
        this.formIsValid = false;
        this.validationMessage = "Please enter valid email and password";
        return;
      }

      if (!this.email.includes("@")) {
        this.formIsValid = false;
        this.validationMessage = "Please enter valid email";
        return;
      }

      this.isLoading = true;

      try {
        if (this.mode === "login") {
          await this.$store.dispatch("auth/login", {
            email: this.email,
            password: this.password,
          });
        } else {
          await this.$store.dispatch("auth/signup", {
            email: this.email,
            name: this.name,
            password: this.password,
          });
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

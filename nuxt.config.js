export default {
  ssr: false,

  head: {
    title: "Tetris",
    htmlAttrs: {
      lang: "en",
    },
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "" },
      { name: "format-detection", content: "telephone=no" },
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
  },

  css: ["~/assets/css/tailwind.css"],

  plugins: [
    { src: "~/plugins/portal-plugin.js", mode: "client" },
    { src: "~/plugins/global-components", mode: "client" },
  ],

  components: true,

  buildModules: ["@nuxtjs/tailwindcss"],

  modules: ["portal-vue/nuxt"],

  build: {},
};

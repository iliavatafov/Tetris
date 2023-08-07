const plugin = require("tailwindcss/plugin");

export default {
  theme: {
    extend: {
      fontFamily: {
        sans: ["Graphik", "sans-serif"],
        serif: ["Merriweather", "serif"],
        cursive: ["Handjet", "cursive"],
      },
      height: {
        "7%": "7%",
        "10%": "10%",
        "20%": "20%",
        "30%": "30%",
        "40%": "40%",
        "50%": "50%",
        "60%": "60%",
        "70%": "70%",
        "80%": "80%",
        "90%": "90%",
        "92%": "92%",
        "100%": "100%",
      },
      colors: {
        cyan: "#8be8e5",
        lavender: "#a084e8",
      },
    },
  },
  plugins: [
    plugin(function ({ addComponents }) {
      addComponents({
        ".custom-top": {
          top: "20vh",
        },

        ".base-input": {
          display: "block",
          width: "100%",
          padding: "0.2rem",
          paddingLeft: "0.5rem",
          fontFamily: "Handjet",
          fontSize: "1.2rem",
          color: "cyan",
          letterSpacing: "2px",
          border: "2px solid cyan",
          backgroundColor: "black",
          "&:focus": {
            borderColor: "#a084e8",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            outline: "#a084e8",
          },
        },
        ".base-label": {
          fontWeight: "bold",
          letterSpacing: "2px",
          marginBottom: "0.3rem",
          marginTop: "1rem",
          display: "block",
          color: "cyan",
          fontSize: "1.2rem",
          fontFamily: "Handjet",
        },
        ".base-btn": {
          letterSpacing: "2px",
          textDecoration: "none",
          padding: "0.75rem 1.5rem",
          font: "Handjet",
          fontSize: "1.2rem",
          fontWeight: "500",
          border: "2px solid cyan",
          color: "cyan",
          cursor: "pointer",
          borderRadius: "30px",
          marginRight: "0.5rem",
          display: "inline-block",
          "&:hover": {
            backgroundColor: "#a084e8",
          },
        },
      });
    }),
  ],
};

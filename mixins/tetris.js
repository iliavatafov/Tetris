const tetrominos = {
  I: [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  J: [
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  L: [
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 0],
  ],
  O: [
    [1, 1],
    [1, 1],
  ],
  S: [
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0],
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0],
  ],
  T: [
    [0, 1, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
};

export const colors = {
  I: "#3877ff",
  O: "#ffe138",
  T: "#ff0d72",
  S: "#f538ff",
  Z: "#ff8e0d",
  J: "#ff8e0d",
  L: "#0dff72",
};

export default {
  data() {
    return {
      colors,
      tetrominos,
      boxSize: 40,
      tetrominosSequance: null,
    };
  },
  methods: {
    createTetrominosSequance() {
      const tetrominos = ["I", "O", "T", "S", "Z", "J", "L"];
      let result = [];
      for (let i = 0; i < 7; i++) {
        const index = this.generateIndex();

        result.push(tetrominos[index]);
      }
      this.tetrominosSequance = result;
    },
    generateIndex() {
      return Math.floor(Math.random() * (7 - 0));
    },
  },
};

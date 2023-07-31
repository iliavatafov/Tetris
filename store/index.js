import { tetrominos } from "../utils/initialTetrominoData";
import { colors } from "../utils/initialTetrominoData";

export const state = () => ({
  tetrominos,
  colors,
  playfield: null,
  tetrominosSequance: null,
  tetromino: null,
  nextTetromino: null,
});

export const mutations = {
  createPlayfield(state, payload) {
    state.playfield = payload;
  },
  createSequance(state, payload) {
    state.tetrominosSequance = payload;
  },
  setTetromino(state, payload) {
    state.tetromino = payload;
  },
};

export const actions = {
  createPlayfield({ commit }) {
    const playfield = [];
    for (let row = -2; row < 20; row++) {
      playfield[row] = [];
      for (let col = 0; col < 10; col++) {
        playfield[row][col] = 0;
      }
    }
    state.playfield = playfield;
    commit("createPlayfield", playfield);
    const sequance = this.createTetrominosSequance();
    commit("createSequance", sequance);
    this.setTetrominoData(this.tetrominosSequance.shift());
    this.nextTetromino = this.tetrominosSequance[0];
  },
  createTetrominosSequance() {
    const tetrominos = ["I", "O", "T", "S", "Z", "J", "L"];

    let result = [];

    for (let i = 0; i < 7; i++) {
      const index = generateIndex();

      result.push(tetrominos[index]);
    }

    return result;

    function generateIndex() {
      return Math.floor(Math.random() * (7 - 0));
    }
  },
  setTetrominoData(state, name) {
    const matrix = JSON.parse(JSON.stringify(this.tetrominos[name]));
    const col = this.playfield[0].length / 2 - Math.ceil(matrix[0].length / 2);
    const row = name === "I" ? -1 : -2;
    this.tetromino = {
      name,
      matrix,
      col,
      row,
      position: "top",
    };
  },
};

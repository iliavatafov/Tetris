<template>
  <canvas
    class="border border-[#00DFA2] border-4"
    width="300"
    height="160"
    id="next-element"
  ></canvas>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  computed: mapState([
    "tetrominos",
    "nextTetromino",
    "colors",
    "boxSize",
    "tetromino",
  ]),
  methods: {
    ...mapActions([
      "createPlayfield",
      "createTetrominosSequance",
      "shiftTetromino",
      "setNextTetromino",
    ]),
    displayNextTetromino(name) {
      const tetrominoData = this.setTetrominoData(name);

      const canvas = document.getElementById("next-element");
      const context = canvas.getContext("2d");

      context.clearRect(0, 0, 300, 150);

      context.fillStyle = this.colors[name];
      for (let row = 0; row < tetrominoData.matrix.length; row++) {
        for (let col = 0; col < tetrominoData.matrix[row].length; col++) {
          if (tetrominoData.matrix[row][col]) {
            context.fillRect(
              (tetrominoData.col + col) * this.boxSize,
              (tetrominoData.row + row) * this.boxSize,
              this.boxSize - 1,
              this.boxSize - 1
            );
          }
        }
      }
    },
    setTetrominoData(name) {
      const matrix = JSON.parse(JSON.stringify(this.tetrominos[name]));
      const col = 8 / 2 - Math.ceil(matrix[0].length / 2);
      const row = 1;
      return {
        name,
        matrix,
        col,
        row,
      };
    },
  },
  mounted() {
    this.displayNextTetromino(this.nextTetromino);
  },
  watch: {
    nextTetromino(value) {
      this.displayNextTetromino(value);
    },
  },
};
</script>

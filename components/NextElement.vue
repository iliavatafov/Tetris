<template>
  <canvas
    class="border border-[#00DFA2] border-4"
    width="300"
    height="160"
    id="next-element"
  ></canvas>
</template>

<script>
import tetris from "~/mixins/tetris.js";

export default {
  props: ["tetromino"],
  mixins: [tetris],
  methods: {
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
  },
  mounted() {
    this.displayNextTetromino(this.tetromino);
  },
  watch: {
    tetromino(value) {
      this.displayNextTetromino(value);
    },
  },
};
</script>

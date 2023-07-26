<template>
  <canvas
    class="border border-white"
    width="320"
    height="640"
    id="game"
  ></canvas>
</template>

<script>
import tetris from "~/mixins/tetris.js";

export default {
  name: "IndexPage",
  mixins: [tetris],
  data() {
    return {
      playfield: null,
      currentTetromino: null,
      canvasContext: null,
    };
  },
  created() {
    const playfield = [];

    for (let row = -2; row < 20; row++) {
      playfield[row] = [];

      for (let col = 0; col < 10; col++) {
        playfield[row][col] = 0;
      }
    }

    this.playfield = playfield;

    this.setTetrominoData();
    this.drawPlayfield();
  },
  mounted() {
    const canvas = document.getElementById("game");
    this.canvasContext = canvas.getContext("2d");
    this.displayTetromino();
  },
  methods: {
    setTetrominoData(name = "O") {
      const matrix = JSON.parse(JSON.stringify(this.tetrominos[name]));
      const startCol =
        this.playfield[0].length / 2 - Math.ceil(matrix[0].length / 2);
      const startRow = name === "I" ? -1 : -2;
      const lastRow = matrix.length - 2;

      this.currentTetromino = {
        name,
        matrix,
        startCol,
        startRow,
        lastRow,
      };
    },
    displayTetromino() {
      const { name } = this.currentTetromino;

      for (let row = -2; row < 20; row++) {
        for (let col = 0; col < 10; col++) {
          if (this.playfield[row][col]) {
            this.canvasContext.fillStyle = this.colors[name];
            this.canvasContext.fillRect(
              col * this.boxSize,
              row * this.boxSize,
              this.boxSize,
              this.boxSize
            );
          }
        }
      }
    },
    drawPlayfield() {
      if (this.canvasContext) {
        this.canvasContext.clearRect(0, 0, 320, 640);
      }
      const playfield = [];
      for (let row = -2; row < 20; row++) {
        playfield[row] = [];

        for (let col = 0; col < 10; col++) {
          playfield[row][col] = 0;
        }
      }
      this.playfield = playfield;

      const { matrix, startCol, startRow, lastRow } = JSON.parse(
        JSON.stringify(this.currentTetromino)
      );

      const endCol = Math.floor(startCol + matrix.length);
      const endRow = Math.floor(startRow + matrix.length);

      for (let row = startRow; row < endRow; row++) {
        const matrixRow = matrix.shift();
        for (let col = startCol; col < endCol; col++) {
          // delete 2
          this.playfield[row][col] = matrixRow.shift();
        }
      }

      if (lastRow < 19) {
        setTimeout(() => {
          this.currentTetromino = {
            ...this.currentTetromino,
            lastRow: this.currentTetromino.lastRow + 1,
            startRow: this.currentTetromino.startRow + 1,
          };
        }, 500);
      }
    },
  },
  watch: {
    playfield() {
      this.displayTetromino();
    },
    currentTetromino() {
      this.drawPlayfield();

      requestAnimationFrame(this.displayTetromino);
    },
  },
};
</script>

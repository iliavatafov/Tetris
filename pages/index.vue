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
      fallSpeed: 800,
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
  },
  mounted() {
    const canvas = document.getElementById("game");
    this.canvasContext = canvas.getContext("2d");
    this.displayTetromino();
    document.body.addEventListener("keydown", this.moveTetromino);
  },
  beforeDestroy() {
    document.body.removeEventListener("keydown", this.moveTetromino);
  },
  methods: {
    drawPlayfield() {
      const { matrix, startCol, startRow, endRow } = JSON.parse(
        JSON.stringify(this.currentTetromino)
      );

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

      const endCol = Math.floor(startCol + matrix.length);

      for (let row = startRow; row <= endRow; row++) {
        const matrixRow = matrix.shift();
        for (let col = startCol; col < endCol; col++) {
          if (row < 20) {
            this.playfield[row][col] = matrixRow.shift();
          }
        }
      }

      if (endRow < 19) {
        setTimeout(() => {
          this.currentTetromino = {
            ...this.currentTetromino,
            endRow: this.currentTetromino.endRow + 1,
            startRow: this.currentTetromino.startRow + 1,
          };
        }, this.fallSpeed);
      }
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
    setTetrominoData(name = "L") {
      const matrix = JSON.parse(JSON.stringify(this.tetrominos[name]));
      const startCol =
        this.playfield[0].length / 2 - Math.ceil(matrix[0].length / 2);
      const startRow = name === "I" ? -1 : -2;
      let endRow = null;

      for (let row = matrix.length - 1; row >= 0; row--) {
        const isendRow = matrix[row].some((el) => el === 1);
        if (isendRow) {
          endRow = name === "I" ? row - 1 : row - 1;
        }
      }

      this.currentTetromino = {
        name,
        matrix,
        startCol,
        startRow,
        endRow,
      };
    },
    moveTetromino(e) {
      if (e.key === "ArrowRight") {
        this.currentTetromino = {
          ...this.currentTetromino,
          startCol: this.currentTetromino.startCol + 1,
        };
      }
      if (e.key === "ArrowLeft") {
        this.currentTetromino = {
          ...this.currentTetromino,
          startCol: this.currentTetromino.startCol - 1,
        };
      }
    },
  },
  watch: {
    currentTetromino(current, last) {
      if (!last) {
        this.drawPlayfield();
        requestAnimationFrame(this.displayTetromino);
      } else if (current.endRow !== last.endRow) {
        this.drawPlayfield();
        requestAnimationFrame(this.displayTetromino);
      }
    },
  },
};
</script>

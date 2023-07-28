<template>
  <div class="bg-[#ffffff] flex gap-12 font-cursive">
    <canvas
      class="border border-[#00DFA2] border-4"
      width="400"
      height="800"
      id="game"
    ></canvas>
    <div>
      <div class="flex flex-col gap-8">
        <next-element
          v-if="nextTetromino"
          :tetromino="nextTetromino"
        ></next-element>
        <ul class="text-black flex flex-col gap-8">
          <score-board-item title="level" :value="level"></score-board-item>
          <score-board-item
            title="lines"
            :value="clearedLines"
          ></score-board-item>
          <score-board-item title="score" :value="score"></score-board-item>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import tetris from "~/mixins/tetris.js";
import ScoreBoardItem from "~/components/ScoreBoardItem.vue";
import NextElement from "~/components/NextElement.vue";

export default {
  name: "IndexPage",
  components: {
    ScoreBoardItem,
    NextElement,
  },
  mixins: [tetris],
  data() {
    return {
      playfield: null,
      tetromino: null,
      count: 0,
      canvas: null,
      context: null,
      fallSpeed: 43,
      clearedLines: 0,
      level: 1,
      score: 0,
      nextTetromino: null,
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
    this.createTetrominosSequance();
    this.setTetrominoData(this.tetrominosSequance.shift());
    this.nextTetromino = this.tetrominosSequance[0];
  },
  mounted() {
    this.animate();
    document.body.addEventListener("keydown", this.moveTetromino);
  },
  beforeDestroy() {
    document.body.removeEventListener("keydown", this.moveTetromino);
  },
  methods: {
    drawPlayfield() {
      if (!this.context || !this.canvas) {
        this.canvas = document.getElementById("game");
        this.context = this.canvas.getContext("2d");
      }
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      for (let row = 0; row < 20; row++) {
        for (let col = 0; col < 10; col++) {
          if (this.playfield[row][col]) {
            const name = this.playfield[row][col];
            this.context.fillStyle = this.colors[name];
            this.context.fillRect(
              col * this.boxSize,
              row * this.boxSize,
              this.boxSize - 1,
              this.boxSize - 1
            );
          }
        }
      }
      if (this.tetromino) {
        this.context.fillStyle = this.colors[this.tetromino.name];
        for (let row = 0; row < this.tetromino.matrix.length; row++) {
          for (let col = 0; col < this.tetromino.matrix[row].length; col++) {
            if (this.tetromino.matrix[row][col]) {
              this.context.fillRect(
                (this.tetromino.col + col) * this.boxSize,
                (this.tetromino.row + row) * this.boxSize,
                this.boxSize - 1,
                this.boxSize - 1
              );
            }
          }
        }
      }
    },
    setTetrominoData(name) {
      const matrix = JSON.parse(JSON.stringify(this.tetrominos[name]));
      const col =
        this.playfield[0].length / 2 - Math.ceil(matrix[0].length / 2);
      const row = name === "I" ? -1 : -2;
      this.tetromino = {
        name,
        matrix,
        col,
        row,
        position: "top",
      };
    },
    isValidMove(matrix, currentRow, currentCol) {
      for (let row = 0; row < matrix.length; row++) {
        for (let col = 0; col < matrix[row].length; col++) {
          if (
            matrix[row][col] &&
            (currentCol + col < 0 ||
              currentCol + col >= this.playfield[0].length ||
              currentRow + row >= this.playfield.length ||
              this.playfield[currentRow + row][currentCol + col])
          ) {
            return false;
          }
        }
      }
      return true;
    },
    addTetrominoToPlayfield() {
      for (let row = 0; row < this.tetromino.matrix.length; row++) {
        for (let col = 0; col < this.tetromino.matrix[row].length; col++) {
          if (this.tetromino.matrix[row][col]) {
            this.playfield[this.tetromino.row + row][this.tetromino.col + col] =
              this.tetromino.name;
          }
        }
      }

      let numberOfClearedLines = 0;

      for (let row = this.playfield.length - 1; row >= 0; ) {
        if (this.playfield[row].every((box) => !!box)) {
          numberOfClearedLines++;

          this.clearedLines++;
          if (this.clearedLines % 10 === 0) {
            this.level++;
            if (this.level < 8) {
              this.fallSpeed -= 5;
            } else if (this.level === 9) {
              this.fallSpeed -= 2;
            } else if (this.level < 28) {
              this.fallSpeed--;
            } else if (this.level === 29) {
              this.fallSpeed = 1;
            }
          }

          for (let r = row; r >= 0; r--) {
            for (let c = 0; c < this.playfield[r].length; c++) {
              this.playfield[r][c] = this.playfield[r - 1][c];
            }
          }
        } else {
          row--;
        }
      }

      switch (numberOfClearedLines) {
        case 1:
          this.score += 100 * this.level;
          break;
        case 2:
          this.score += 300 * this.level;
          break;
        case 3:
          this.score += 500 * this.level;
          break;
        case 4:
          this.score += 800 * this.level;
          break;
      }

      if (this.tetrominosSequance.length === 0) {
        this.createTetrominosSequance();
      }
      this.setTetrominoData(this.tetrominosSequance.shift());
      this.nextTetromino = this.tetrominosSequance[0];
    },
    moveTetromino(e) {
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        const col =
          e.key === "ArrowLeft"
            ? this.tetromino.col - 1
            : this.tetromino.col + 1;
        if (this.isValidMove(this.tetromino.matrix, this.tetromino.row, col)) {
          this.tetromino.col = col;
        }
      }
      if (e.key === "ArrowDown") {
        const row = this.tetromino.row + 1;
        if (!this.isValidMove(this.tetromino.matrix, row, this.tetromino.col)) {
          this.tetromino.row = row - 1;
          this.addTetrominoToPlayfield();
          return;
        }
        this.tetromino.row = row;
      }
      if (e.key === "ArrowUp") {
        this.tetromino.matrix = this.tetromino.matrix.map((row, rowIndex) => {
          return row.map((cell, cellIndex) => {
            return this.tetromino.matrix[
              this.tetromino.matrix.length - 1 - cellIndex
            ][rowIndex];
          });
        });
      }
    },
    animate() {
      const animationFrame = () => {
        this.drawPlayfield();
        this.count++;
        if (this.count >= this.fallSpeed) {
          this.tetromino.row++;
          this.count = 0;
          if (
            !this.isValidMove(
              this.tetromino.matrix,
              this.tetromino.row,
              this.tetromino.col
            )
          ) {
            this.tetromino.row--;
            this.addTetrominoToPlayfield();
          }
        }
        requestAnimationFrame(animationFrame);
      };
      animationFrame();
    },
  },
};
</script>

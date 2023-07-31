<template>
  <div>
    <portal-target name="body-dialog"></portal-target>
    <game-over
      v-if="gamaeOver"
      @playAgain="playAgain"
      :level="level"
      :clearedLines="clearedLines"
      :score="score"
    ></game-over>
    <start-game v-if="!isGameStart" @gameStart="startGame"></start-game>
    <div
      v-if="isGameStart && !gamaeOver"
      class="bg-[#ffffff] flex gap-12 font-cursive"
    >
      <canvas
        class="border border-[#00DFA2] border-4"
        width="400"
        height="800"
        id="game"
      ></canvas>
      <div>
        <score-board
          :level="level"
          :clearedLines="clearedLines"
          :score="score"
          :nextTetromino="nextTetromino"
        ></score-board>
      </div>
    </div>
  </div>
</template>

<script>
import tetris from "~/mixins/tetris.js";
import ScoreBoard from "~/components/ScoreBoard.vue";
import StartGame from "~/components/StartGame.vue";
import GameOver from "~/components/GameOver.vue";

export default {
  components: {
    ScoreBoard,
    StartGame,
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
      isGameStart: false,
      gamaeOver: false,
    };
  },
  created() {
    this.createPlayfield();
  },
  mounted() {
    document.body.addEventListener("keydown", this.moveTetromino);
  },
  beforeDestroy() {
    document.body.removeEventListener("keydown", this.moveTetromino);
  },
  methods: {
    playAgain() {
      this.playfield = null;
      this.tetromino = null;
      this.count = 0;
      this.canvas = null;
      this.context = null;
      this.fallSpeed = 43;
      this.clearedLines = 0;
      this.level = 1;
      this.score = 0;
      this.nextTetromino = null;
      this.gamaeOver = false;

      this.createPlayfield();
      this.animate();
    },
    createPlayfield() {
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
    startGame() {
      this.isGameStart = true;
      this.animate();
    },
    drawPlayfield() {
      if (!this.context || !this.canvas) {
        this.canvas = document.getElementById("game");
        if (!this.canvas) {
          return;
        }
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
            if (this.tetromino.row + row < 0) {
              this.gamaeOver = true;
            }
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
      if (this.tetrominosSequance.length === 1) {
        this.setTetrominoData(this.tetrominosSequance.shift());
        this.createTetrominosSequance();
        this.nextTetromino = this.tetrominosSequance[0];
      } else {
        this.setTetrominoData(this.tetrominosSequance.shift());
        this.nextTetromino = this.tetrominosSequance[0];
      }
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
        if (!this.gamaeOver) {
          requestAnimationFrame(animationFrame);
        } else {
          cancelAnimationFrame(animationFrame);
        }
      };

      animationFrame();
    },
  },
  watch: {
    isGameStart(isStarted) {
      if (isStarted) {
        this.animate();
      }
    },
  },
};
</script>

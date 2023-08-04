import initialState from "~/utils/initialState";

export const state = () => ({ ...initialState });

export const mutations = {
  startGame(state, payload) {
    state.isGameStart = payload;
  },
  setGameOver(state, payload) {
    state.gameOver = payload;
  },
  createPlayfield(state, payload) {
    state.playfield = payload;
  },
  createSequance(state, payload) {
    state.tetrominosSequance = payload;
  },
  shiftTetromino(state) {
    state.tetrominosSequance = state.tetrominosSequance.slice(1);
  },
  setTetromino(state, payload) {
    state.tetromino = payload;
  },
  setTetrominoCol(state, payload) {
    state.tetromino.col = payload;
  },
  setTetrominoRow(state, payload) {
    state.tetromino.row = payload;
  },
  increaseTetrominoRow(state) {
    state.tetromino.row++;
  },
  decreaseTetrominoRow(state) {
    state.tetromino.row--;
  },
  setTetrominoMatrix(state, payload) {
    state.tetromino.matrix = payload;
  },
  setNextTetromino(state, payload) {
    state.nextTetromino = payload;
  },
  resetState(state, payload) {
    Object.assign(state, payload);
  },
  setCount(state, payload) {
    state.count = payload;
  },
  increaseCount(state) {
    state.count++;
  },
  increaseClearedLines(state) {
    state.clearedLines++;
  },
  increaseLevel(state) {
    state.level++;
  },
  setFallSpeed(state, payload) {
    state.fallSpeed = payload;
  },
  increaseFallSpeed(state, payload) {
    state.fallSpeed += payload;
  },
  decreaseFallSpeed(state, payload) {
    state.fallSpeed -= payload;
  },
  increaseScore(state, payload) {
    state.score += payload;
  },
  setCanvas(state, payload) {
    state.canvas = payload;
  },
  setContext(state, payload) {
    state.context = payload;
  },
  cancelAnimation(state) {
    state.cancelAnimation = true;
  },
};

export const actions = {
  startGame({ commit, dispatch }) {
    commit("startGame", true);
    dispatch("animate");
  },

  async createPlayfield({ state, commit, dispatch }) {
    const playfield = [];

    for (let row = -2; row < 20; row++) {
      playfield[row] = [];
      for (let col = 0; col < 10; col++) {
        playfield[row][col] = 0;
      }
    }

    commit("createPlayfield", playfield);
    dispatch("createTetrominosSequance");

    dispatch("setTetrominoData", state.tetrominosSequance[0]);
    commit("shiftTetromino");
    commit("setNextTetromino", state.tetrominosSequance[0]);
  },

  drawPlayfield({ state, commit }) {
    if (!state.context || !state.canvas) {
      commit("setCanvas", document.getElementById("game"));

      if (!state.canvas) {
        return;
      }

      commit("setContext", state.canvas.getContext("2d"));
    }

    state.context.clearRect(0, 0, state.canvas.width, state.canvas.height);

    for (let row = 0; row < 20; row++) {
      for (let col = 0; col < 10; col++) {
        if (state.playfield[row][col]) {
          const name = state.playfield[row][col];
          state.context.fillStyle = state.colors[name];
          state.context.fillRect(
            col * state.boxSize,
            row * state.boxSize,
            state.boxSize - 1,
            state.boxSize - 1
          );
        }
      }
    }

    if (state.tetromino) {
      state.context.fillStyle = state.colors[state.tetromino.name];

      for (let row = 0; row < state.tetromino.matrix.length; row++) {
        for (let col = 0; col < state.tetromino.matrix[row].length; col++) {
          if (state.tetromino.matrix[row][col]) {
            state.context.fillRect(
              (state.tetromino.col + col) * state.boxSize,
              (state.tetromino.row + row) * state.boxSize,
              state.boxSize - 1,
              state.boxSize - 1
            );
          }
        }
      }
    }
  },

  animate({ state, commit, dispatch }) {
    const animationFrame = async () => {
      dispatch("drawPlayfield");
      commit("increaseCount");

      if (state.count >= state.fallSpeed) {
        commit("increaseTetrominoRow");
        commit("setCount", 0);

        const isValidMove = await dispatch("isValidMove", {
          matrixData: state.tetromino.matrix,
          rowData: state.tetromino.row,
          colData: state.tetromino.col,
        });

        if (!isValidMove) {
          commit("decreaseTetrominoRow");
          dispatch("addTetrominoToPlayfield");
        }
      }
      if (!state.gameOver) {
        requestAnimationFrame(animationFrame);
      } else {
        cancelAnimationFrame(animationFrame);
      }
    };

    if (state.tetromino && !state.cancelAnimation) {
      animationFrame();
    }
  },

  cancelAnimation({ commit }) {
    commit("cancelAnimation");
  },

  async addTetrominoToPlayfield({ state, commit, dispatch }) {
    for (let row = 0; row < state.tetromino.matrix.length; row++) {
      for (let col = 0; col < state.tetromino.matrix[row].length; col++) {
        if (state.tetromino.matrix[row][col]) {
          if (state.tetromino.row + row < 0) {
            commit("setGameOver", true);
          }
          state.playfield[state.tetromino.row + row][
            state.tetromino.col + col
          ] = state.tetromino.name;
        }
      }
    }

    let numberOfClearedLines = 0;

    for (let row = state.playfield.length - 1; row >= 0; ) {
      if (state.playfield[row].every((box) => !!box)) {
        numberOfClearedLines++;

        commit("increaseClearedLines");
        if (state.clearedLines % 10 === 0) {
          commit("increaseLevel");
          if (state.level < 8) {
            commit("decreaseFallSpeed", 5);
          } else if (state.level === 9) {
            commit("decreaseFallSpeed", 2);
          } else if (state.level < 28) {
            commit("decreaseFallSpeed", 1);
          } else if (state.level === 29) {
            commit("setFallSpeed", 1);
          }
        }

        for (let r = row; r >= 0; r--) {
          for (let c = 0; c < state.playfield[r].length; c++) {
            state.playfield[r][c] = state.playfield[r - 1][c];
          }
        }
      } else {
        row--;
      }
    }

    switch (numberOfClearedLines) {
      case 1:
        commit("increaseScore", 100 * state.level);
        break;
      case 2:
        commit("increaseScore", 300 * state.level);
        break;
      case 3:
        commit("increaseScore", 500 * state.level);
        break;
      case 4:
        commit("increaseScore", 800 * state.level);
        break;
    }

    if (state.tetrominosSequance.length === 1) {
      const currentTetromino = state.tetrominosSequance[0];
      commit("shiftTetromino");
      dispatch("setTetrominoData", currentTetromino);
      dispatch("createTetrominosSequance");
      dispatch("setNextTetromino", state.tetrominosSequance[0]);
    } else {
      const currentTetromino = state.tetrominosSequance[0];
      commit("shiftTetromino");
      dispatch("setTetrominoData", currentTetromino);
      dispatch("setNextTetromino", state.tetrominosSequance[0]);
    }
  },

  async moveTetromino({ state, commit, dispatch }, e) {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      const col =
        e.key === "ArrowLeft"
          ? state.tetromino.col - 1
          : state.tetromino.col + 1;

      const isValid = await dispatch("isValidMove", {
        matrixData: state.tetromino.matrix,
        rowData: state.tetromino.row,
        colData: col,
      });

      if (isValid) {
        dispatch("setTetrominoCol", col);
      }
    }
    if (e.key === "ArrowDown") {
      const row = state.tetromino.row + 1;
      commit("increaseTetrominoRow");

      const isValid = await dispatch("isValidMove", {
        matrixData: state.tetromino.matrix,
        rowData: row,
        colData: state.tetromino.col,
      });

      if (!isValid) {
        commit("decreaseTetrominoRow");
        dispatch("addTetrominoToPlayfield");
        return;
      }

      dispatch("setTetrominoRow", row);
    }
    if (e.key === "ArrowUp") {
      const matrix = state.tetromino.matrix.map((row, rowIndex) => {
        return row.map((cell, cellIndex) => {
          return state.tetromino.matrix[
            state.tetromino.matrix.length - 1 - cellIndex
          ][rowIndex];
        });
      });

      const isValid = await dispatch("isValidMove", {
        matrixData: matrix,
        rowData: state.tetromino.row,
        colData: state.tetromino.col,
      });

      if (isValid) {
        dispatch("setTetrominoMatrix", matrix);
      }
    }
  },

  isValidMove({ state }, { matrixData, rowData, colData }) {
    for (let row = 0; row < matrixData.length; row++) {
      for (let col = 0; col < matrixData[row].length; col++) {
        if (
          matrixData[row][col] &&
          (colData + col < 0 ||
            colData + col >= state.playfield[0].length ||
            rowData + row >= state.playfield.length ||
            state.playfield[rowData + row][colData + col])
        ) {
          return false;
        }
      }
    }
    return true;
  },

  createTetrominosSequance({ commit }) {
    const tetrominos = ["I", "O", "T", "S", "Z", "J", "L"];

    let result = [];

    for (let i = 0; i < 7; i++) {
      const index = generateIndex();
      result.push(tetrominos[index]);
    }

    commit("createSequance", result);

    function generateIndex() {
      return Math.floor(Math.random() * (7 - 0));
    }
  },

  setTetrominoData({ state, commit }, name) {
    const matrix = JSON.parse(JSON.stringify(state.tetrominos[name]));
    const col = state.playfield[0].length / 2 - Math.ceil(matrix[0].length / 2);
    const row = name === "I" ? -1 : -2;

    commit("setTetromino", {
      name,
      matrix,
      col,
      row,
      position: "top",
    });
  },

  setTetrominoCol({ commit }, payload) {
    commit("setTetrominoCol", payload);
  },

  setTetrominoRow({ commit }, payload) {
    commit("setTetrominoRow", payload);
  },

  setTetrominoMatrix({ commit }, payload) {
    commit("setTetrominoMatrix", payload);
  },

  playAgain({ commit, dispatch }) {
    commit("resetState", initialState);
    dispatch("createPlayfield");
  },

  resetState({ state, commit }) {
    commit("resetState", { ...initialState, isGameStart: false });
  },

  setNextTetromino({ commit }, payload) {
    commit("setNextTetromino", payload);
  },
};

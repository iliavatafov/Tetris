import { tetrominos } from "~/utils/initialTetrominoData";
import { colors } from "~/utils/initialTetrominoData";

export default {
  tetrominos,
  tetromino: null,
  colors,
  playfield: null,
  tetrominosSequance: null,
  tetromino: null,
  nextTetromino: null,
  count: 0,
  fallSpeed: 43,
  gameOver: false,
  clearedLines: 0,
  level: 1,
  score: 0,
  canvas: null,
  context: null,
  isGameStart: false,
  boxSize: 40,
};

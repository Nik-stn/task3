const HMACGenerator = require("./HMACGenerator");
const GameLogic = require("./GameLogic");
const { MinMoves } = require("./constants");

class Game {
  constructor(moves) {
    if (moves.length < MinMoves || moves.length % 2 === 0) {
      throw new Error(
        "Invalid input: please provide an odd number of moves, at least 3."
      );
    }

    const uniqueMoves = new Set(moves);
    if (uniqueMoves.size !== moves.length) {
      throw new Error(
        "Invalid input: moves must be unique. Example: rock paper scissors."
      );
    }

    this.moves = moves;
    this.logic = new GameLogic(moves);
    this.key = HMACGenerator.generateKey();
    this.computerMoveIndex = Math.floor(Math.random() * moves.length);
    this.hmac = HMACGenerator.generateHMAC(
      this.key,
      moves[this.computerMoveIndex]
    );
  }

  printMenu() {
    console.log(`HMAC: ${this.hmac}`);
    console.log("Available moves:");
    this.moves.forEach((move, index) => {
      console.log(`${index + 1} - ${move}`);
    });
    console.log("0 - exit");
    console.log("? - help");
  }

  play(playerInput) {
    const playerMoveIndex = parseInt(playerInput, 10) - 1;

    if (playerInput === "?") {
      this.logic.rules.printHelp();
    } else if (playerInput === "0") {
      console.log("Exiting game.");
      process.exit();
    } else if (
      isNaN(playerMoveIndex) ||
      playerMoveIndex < 0 ||
      playerMoveIndex >= this.moves.length
    ) {
      console.log("Invalid input. Please try again.");
    } else {
      const playerMove = this.moves[playerMoveIndex];
      const computerMove = this.moves[this.computerMoveIndex];

      console.log(`Your move: ${playerMove}`);
      console.log(`Computer move: ${computerMove}`);

      const result = this.logic.determineWinner(
        playerMoveIndex,
        this.computerMoveIndex
      );
      console.log(
        result === "Win"
          ? "You win!"
          : result === "Lose"
          ? "You lose!"
          : "It's a draw!"
      );

      console.log(`HMAC key: ${this.key.toString("hex")}`);
    }
  }
}

module.exports = Game;

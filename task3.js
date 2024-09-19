const crypto = require("crypto");

class HMACGenerator {
  static generateKey() {
    return crypto.randomBytes(32); 
  }

  static generateHMAC(key, message) {
    return crypto.createHmac("sha256", key).update(message).digest("hex");
  }
}

class GameRules {
  constructor(moves) {
    this.moves = moves;
    this.numMoves = moves.length;
  }

  printHelp() {
    console.log("\nHelp table:");
    const table = this.generateTable();
    console.table(table);
  }

  generateTable() {
    const table = [[" "].concat(this.moves)];

    for (let i = 0; i < this.numMoves; i++) {
      const row = [this.moves[i]];
      for (let j = 0; j < this.numMoves; j++) {
        if (i === j) {
          row.push("Draw");
        } else if (this.isWin(i, j)) {
          row.push("Win");
        } else {
          row.push("Lose");
        }
      }
      table.push(row);
    }

    return table;
  }

  isWin(playerMoveIndex, opponentMoveIndex) {
    const half = Math.floor(this.numMoves / 2);
    return (
      (opponentMoveIndex > playerMoveIndex &&
        opponentMoveIndex <= playerMoveIndex + half) ||
      (opponentMoveIndex < playerMoveIndex &&
        opponentMoveIndex <= (playerMoveIndex + half) % this.numMoves)
    );
  }
}

class GameLogic {
  constructor(moves) {
    this.rules = new GameRules(moves);
  }

  determineWinner(playerMove, computerMove) {
    if (playerMove === computerMove) {
      return "Draw";
    } else if (this.rules.isWin(playerMove, computerMove)) {
      return "Win";
    } else {
      return "Lose";
    }
  }
}

class Game {
  constructor(moves) {
    if (moves.length < 3 || moves.length % 2 === 0) {
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

const moves = process.argv.slice(2);

if (moves.length < 3 || moves.length % 2 === 0) {
  console.error(
    "Error: You must provide an odd number of unique moves (at least 3). Example: rock paper scissors."
  );
  process.exit(1);
}

const uniqueMoves = new Set(moves);
if (uniqueMoves.size !== moves.length) {
  console.error(
    "Error: Moves must be unique. Example: rock paper scissors."
  );
  process.exit(1);
}

const game = new Game(moves);
game.printMenu();

process.stdin.setEncoding("utf8");
process.stdin.on("data", (input) => {
  const trimmedInput = input.trim();
  game.play(trimmedInput);
  game.printMenu(); 
});

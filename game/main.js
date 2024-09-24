const Game = require("./Game");

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

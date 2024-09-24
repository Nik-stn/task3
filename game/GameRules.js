const Table = require("table"); // Подключаем библиотеку для создания таблицы

class GameRules {
  constructor(moves) {
    this.moves = moves;
    this.numMoves = moves.length;
  }

  printHelp() {
    console.log("\nHelp table:");
    const table = this.generateTable();
    console.log(Table.table(table));
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

module.exports = GameRules;

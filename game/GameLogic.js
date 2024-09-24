const GameRules = require("./GameRules");

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

module.exports = GameLogic;

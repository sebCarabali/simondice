const MAX_LEVELS = 3;

function $(selector, container) {
  return (container || document).querySelector(selector);
}

(function () {
  var _ = (self.Simon = function () {
    this.initGame();
  });

  _.prototype = {
    initGame: function () {
      this.actualLevel = 1;
      this.sequence = [];
      this.genLevels();
    },
    genLevels: function () {
      for (let i = 0; i < MAX_LEVELS; i++) {
        this.sequence.push(Math.floor(Math.random() * 4));
      }
    },
    isWinning: function () {
      return this.actualLevel === MAX_LEVELS + 1;
    },
    nextLevel: function () {
      this.actualLevel += 1;
    },
    getNextSequence: function () {
      return this.sequence.slice(0, this.actualLevel);
    },
  };
})();

(function () {
  var _ = (self.SimonView = function (controller) {
    this.controller = controller;
    this.init();
  });

  _.prototype = {
    init: function () {
      this.getColors();
      this.addClickEvents();
    },
    getColors: function () {
      this.colors = [
        $(".btn.red"),
        $(".btn.green"),
        $(".btn.yellow"),
        $(".btn.blue"),
      ];
    },
    clickCallback: async function (evt) {
      if (this.controller.isPlaying) {
        let colorIdx = this.colors.findIndex((color) => evt.target === color);
        this.printSequence([colorIdx]);
        await this.controller
          .makeMove(colorIdx)
          .then((res) => {
            if (res === true) {
              alert("Has ganado el juego");
              this.controller.resetGame();
              this.showInitButton();
            } else {
              console.log("Printing seq");
              this.printSequence(res);
            }
          })
          .catch((err) => {
            alert("Movimiento incorrecto!!");
            this.controller.resetGame();
            this.showInitButton();
          });
      }
    },
    addClickEvents: function () {
      this.colors.forEach((color) => {
        color.addEventListener("click", this.clickCallback.bind(this));
      });

      $(".playbutton").addEventListener("click", (evt) => {
        evt.target.classList.add("hide");
        this.controller.initGame();
      });
    },
    showInitButton: function () {
      $(".playbutton").classList.remove("hide");
    },
    printSequence: async function (sequence) {
      if (this.controller.isPlaying) {
        for (let i = 0; i < sequence.length; i++) {
          await this.buttonOn(this.colors[sequence[i]]).then((color) => {
            return this.buttonOff(color);
          });
        }
      }
    },
    buttonOn: function (color) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          color.classList.add("light");
          resolve(color);
        }, 300);
      });
    },
    buttonOff: function (color) {
      return new Promise((res, rej) => {
        setTimeout(() => {
          color.classList.remove("light");
          res(color);
        }, 500);
      });
    },
    showWinMessage: function () {
      alert("Has ganado el guego!!");
      this.showInitButton();
    },
  };
})();

(function () {
  var _ = (self.SimonController = function () {
    this.game = new Simon();
    this.view = new SimonView(this);
    this.currentMove = 0;
    this.isPlaying = false;
  });

  _.prototype = {
    initGame: function () {
      this.isPlaying = true;
      this.currentMove = 0;
      this.view.printSequence(this.game.getNextSequence());
    },
    resetGame: function () {
      this.isPlaying = false;
      this.currentMove = 0;
      this.game.initGame();
    },
    passToNextLevel: function () {
      this.currentMove = 0;
      this.game.nextLevel();
      this.view.printSequence(this.game.getNextSequence());
    },
    makeMove: function (colorVal) {
      return new Promise((resolve, reject) => {
        let isTheMove = this.game.sequence[this.currentMove++] === colorVal;
        if (isTheMove && this.currentMove === this.game.actualLevel) {
          console.log("Passing to the next level");
          setTimeout(() => {
            this.passToNextLevel();
            if (this.game.isWinning()) {
              this.isPlaying = false;
              this.view.showWinMessage();
              resolve(true);
            }
            resolve(this.game.getNextSequence());
          }, 1500);
        } else if (!isTheMove) {
          this.isPlaying = false;
          reject(false);
        }

        resolve(false);
      });
    },
  };
})();

let controller = new SimonController();

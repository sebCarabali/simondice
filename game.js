function $(selector, container) {
  return (container || document).querySelector(selector);
}

(function () {
  var _ = (self.Game = function (maxLevel) {
    this.maxLevel = maxLevel;
    this.init();
  });

  _.prototype = {
    init: function () {
      this.currentLevel = 1;
      this.sequence = [];
      this.currentMove = 0;
      this.genSequence();
    },

    genSequence: function () {
      for (let i = 0; i < this.maxLevel; i++) {
        this.sequence.push(Math.floor(Math.random() * 4));
      }
    },

    makeMove: function (move) {
      return move === this.sequence[this.currentMove++];
    },

    goToNextLevel: function () {
      this.currentLevel++;
      this.currentMove = 0;
    },

    isSuccesLevel: function () {
      return this.currentMove === this.currentLevel;
    },

    getCurrentSequence: function () {
      return this.sequence.slice(0, this.currentLevel);
    },

    isWinning: function() {
      return this.currentLevel === this.maxLevel+1;
    }
  };
})();

(function () {
  var _ = (self.Octupus = function (model, view) {
    this.model = model;
    this.view = view;
    this.handleClick = this.handleClick.bind(this);
    this.init();
  });

  _.prototype = {
    init: function () {
      this.loadColors();
      this.addEvents();
    },

    loadColors: function () {
      this.colors = [
        $(".btn.red"),
        $(".btn.green"),
        $(".btn.yellow"),
        $(".btn.blue"),
      ];
    },

    newGame: function () {
      this.canClick = false;
      this.model.init();
      this.makeAPause(500).then((res) => {
        this.giveSequence();
      });
    },

    makeAPause: function (ms) {
      return new Promise((res, rej) => {
        setTimeout(() => {
          res();
        }, ms);
      });
    },

    giveSequence: async function () {
      let idxSeq = this.model.getCurrentSequence();
      let colorSequence = idxSeq.map((idx) => this.colors[idx]);
      await this.view.animateSequence(colorSequence);
      this.makeAPause(500).then((res) => {
        this.canClick = true;
      });
    },

    addEvents: function () {
      this.colors.forEach((color) => {
        color.addEventListener("click", this.handleClick);
      });

      $(".playbutton").addEventListener("click", (evt) => {
        this.newGame();
        evt.target.classList.add("hide");
      });
    },

    handleClick: function (evt) {
      // TODO: refactorizar
      if (this.canClick) {
        let color = evt.target;
        let colorIdx = this.colors.findIndex((c) => c === color);
        console.log(colorIdx);
        this.canClick = false;
        this.view.animateColor(color).then((res) => {
          if (this.model.makeMove(colorIdx)) {
            if (this.model.isSuccesLevel()) {
              this.canClick = false;
              this.model.goToNextLevel();
              if(this.model.isWinning()){
                alert("Felicitaciones, has ganado el juego!!");
                $(".playbutton").classList.remove("hide");
                return;
              }
              this.makeAPause(500).then(() => {
                this.giveSequence();
              });
            }
            this.canClick = true;
          } else {
            alert("Error, vuelve a empezar");
            this.canClick = false;
            $(".playbutton").classList.remove("hide");
          }
        });
      }
    },
  };
})();

(function () {
  var _ = (self.View = function () {});

  _.prototype = {
    animateColor: function (color) {
      // TODO: refactorizar
      return new Promise((res, rej) => {
        new Promise((res, rej) => {
          setTimeout(() => {
            this.colorOn(color);
            res();
          }, 200);
        }).then(() => {
          setTimeout(() => {
            this.colorOff(color);
            res(true);
          }, 600);
        });
      });
    },

    colorOn: function (color) {
      color.classList.add("light");
    },

    colorOff: function (color) {
      color.classList.remove("light");
    },

    animateSequence: function (colorSequence) {
      colorSequence.reduce((previusPromise, nextColor) => {
        return previusPromise.then(() => {
          return this.animateColor(nextColor);
        });
      }, Promise.resolve());
    },
  };
})();

var model = new Game(10);
var view = new View();
var octupus = new Octupus(model, view);

const MAX_LEVELS = 10;

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
      return this.actualLevel === MAX_LEVELS;
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
  var _ = (self.SimonView = function () {
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
    addClickEvents: function () {
      this.colors.forEach((item) => {
        item.addEventListener("click", (ev) => {
          console.log(ev.target);
          console.log(this);
        });
      });
    },
    printSequence: async function (sequence) {
      for (let i = 0; i < sequence.length; i++) {
        await this.buttonOn(this.colors[i]).then((color) => {
          return this.buttonOff(color);
        });
      }
    },
    buttonOn: function (color) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          color.classList.add("light");
          resolve(color);
        }, 1000);
      });
    },
    buttonOff: function (color) {
      return new Promise((res, rej) => {
        setTimeout(() => {
          color.classList.remove("light");
          res(color);
        }, 1100);
      });
    },
  };
})();

(function () {
  var _ = (self.SimonController = function () {});
  _.prototype = {};
})();

let simon = new Simon();
let simonView = new SimonView();

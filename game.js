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
  var _ = (self.SimonView = function () {});

  _.prototype = {};
})();

(function () {
  var _ = (self.SimonController = function () {});
  _.prototype = {};
})();

let simon = new Simon();
let simonView = new SimonView();


const Table = require('./classes/Table');
const Tournament = require('./classes/Tournament');
const Player = require('./classes/Player');
const prompt = require('prompt');
const clear = require('clear');

const players = [];
//fake players
for (let i = 0; i < 6; i += 1) {
  players.push(new Player({
    name: null,
    id: i + 1,
    isHuman: false
  }));
  players[i].generateName();
  players[i].createCallFrequencies();
}


clear();
console.log('Hi Card Tournament');

prompt.start();
prompt.get(['enter to start'], function (err, result) {
  if (err) { console.log(err); }

  //new tourney
  const tourney = new Tournament({
    startingChips : 3,
    numTables : 1,
    handsPerRound : 10,
    players : players,
    humanPlayers : 0
  });

  tourney.init();
  tourney.startNewHand();
});

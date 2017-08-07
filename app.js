const mockPlayers = require('./mock/players.json');
const Table = require('./Table');
const Tournament = require('./Tournament');

const tourney = new Tournament({
  startingChips : 3,
  numTables : 1,
  handsPerRound : 10,
  players : mockPlayers,
  humanPlayers : 0
});

tourney.init();

/*
if folded, player.currentHand will be null

Hand = {
  card : Card,
  wager : Int,
  rank : Int
}

Card = {
  name : String,
  value : Int
}
*/

const SAK = require('./SwissArmyKnife');
const Table = require('./Table');
const mockPlayers = require('./mock/players.json');

class Tournament extends SAK {
  constructor(opts) {
    super();
    this.startingChips = opts.startingChips;
    this.numTables = opts.numTables;
    this.handsPerRound = opts.handsPerRound;
    this.allPlayers = this.shuffle(opts.players);
    this.humanPlayers = opts.humanPlayers;
    this.tables = [];
  }

  getPlayerById(id, players) {
    for(let i = 0; i < players.length; i += 1 ) {
      if (id === players[i].id) {
        return players[i];
      }
    }
    return -1;
  }

  init() {
    //create tables
    for(let i = 0; i < this.numTables; i += 1) {
      this.tables.push(new Table({id: i}))
    }

    this.tables.forEach(table => {
      //pass in 6 players, work on this, just dummy
      table.init([76, 44, 19, 22, 17, 2]);
      console.log(table);
      console.log(table.getPlayersAtTable());
    })
  }

}

module.exports = Tournament;

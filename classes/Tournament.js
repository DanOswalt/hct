const SAK = require('./SwissArmyKnife');
const Table = require('./Table');


//display info happens here

class Tournament extends SAK {

  constructor(opts) {
    super();
    this.startingChips = opts.startingChips;
    this.numTables = opts.numTables;
    this.handsPerRound = opts.handsPerRound;
    this.allPlayers = this.shuffle(opts.players);
    this.humanPlayers = opts.humanPlayers;
    this.tables = [];
    this.ante = 1;
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
      this.tables.push(new Table({id: i, tournament: this}))
    };

    //gather player ids
    const allPlayerIds = this.allPlayers.map(player => {
      return player.id;
    })

    //chop off six ids at a time to seat players at table   
    this.tables.forEach(table => {
      //pass in 6 players at a time
      const tablePlayerIds = allPlayerIds.splice(0,6);
      table.init(tablePlayerIds, this.startingChips, this.allPlayers);
    })
  }

  startNewHand() {
    this.tables.forEach(table => {
      const players = table.getPlayersAtTable(this.allPlayers);
      const result = table.playHand(players, this.ante);

      console.log(result);
      //console.log(players);
    })
  }

  displayTable() {
    clear();
  }
}

module.exports = Tournament;

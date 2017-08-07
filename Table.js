const SAK = require('./SwissArmyKnife');
const mockPlayers = require('./mock/players.json');



// const getPlayerById = (id, players) => {
//   for(let i = 0; i < players.length; i +=1 ) {
//     if (id === players[i].id) {
//       return players[i];
//     }
//   }
//   return -1;
// }
//
// const startingChips = 3;

/*

Order of states for the Table

//pre hand
-Instantiated (has nothing more than an id supplied by Tournament)
-Seating players (Tournament gives an array of player ids)
(This would either be just after instantiation, or when balancing tables)

//hand
-Begin Hand (Tournament gives the go ahead)
-Moving Blind/Active seat (skip over empty seats)
-Deal Hand (card given to each player)
-Ask each player for a decision

//


*/



class Table extends SAK {

  constructor(opts) {
    //why do I have to call super() before I can use 'this'?
    super();
    this.id = opts.id;
    this.seats = [
      { name : 'seat1',
        occupant : null },
      { name : 'seat2',
        occupant : null },
      { name : 'seat3',
        occupant : null },
      { name : 'seat4',
        occupant : null },
      { name : 'seat5',
        occupant : null },
      { name : 'seat6',
        occupant : null },
    ];
    this.currentHand = {
      handNumber : null,
      pots : null,
      bettors : []
    }
    this.blindSeatIndex = this.randNum(0,5);
    this.activeSeatIndex = this.blindSeatIndex > 5 ? 0 : this.blindSeatIndex + 1;
  }



  createPots() {
    //private function to check for equality
    const _betsVary = (bettors) => {
      const firstBet = bettors[0].chips;
      return bettors.some(bettor => { return bettor.chips !== firstBet });
    };

    //private function to gather bets
    const _getMemberIds = (bettors) => {
      return bettors.map(bettor => {return bettor.playerId});
    }

    const pots = [];
    const potNames = [
      'SidePot D',
      'SidePot C',
      'SidePot B',
      'SidePot A',
      'MainPot'
    ];

    //while bets are not equal, there will need to be a sidepot created
    while (_betsVary(this.currentHand.bettors)) {

      //find smallest common chip value
      let min = 10000000000;
      this.currentHand.bettors.forEach((bettor) => {min = bettor.chips > min ? min : bettor.chips});

      //create a pot
      pots.push({
        name: potNames.pop(),
        chips: this.currentHand.bettors.length * min,
        members: this.currentHand.bettors.map((bettor) => {return bettor.playerId}),
        winnerId: null
      });

      //subtract min from this.currentHand.bettors, remove this.currentHand.bettors with no remaining chips after sidepot
      this.currentHand.bettors = this.currentHand.bettors.map(bettor => {
        bettor.chips -= min;
        return bettor;
      }).filter(bettor => {
        return bettor.chips > 0;
      });
    };

    //create last (or only) pot from remaining this.currentHand.bettors
    pots.push({
      name: potNames.pop(),
      chips: this.currentHand.bettors.length * this.currentHand.bettors[0].chips,
      members: _getMemberIds(this.currentHand.bettors),
      winnerId: null
    });

    return pots;
  }



  filterPotMembers(pot) {
    return this.allPlayersAtTable.filter((player) => {
      return pot.members.some((memberId) => {
        return player.id === memberId;
      });
    });
  }



  findWinnersOfAllPots(pots) {
    return pots.map((pot) => {
      return this.getWinnerOfPot(pot, this.filterPotMembers(pot, this.allPlayersAtTable));
    });
  }



  getBetsFromPlayersWithHands() {
    const players = this.getPlayersAtTable();
    return players.filter(player => {
      return player.currentHand;
    }).map((player) => {
      return {
        playerId : player.id,
        chips : player.currentHand.bet
      }
    })
  }



  getEmptySeatCount() {
    let count = 0;
    this.seats.forEach(seat => {
      if (seat.occupant === null) {
        count++;
      };
    });
    return count;
  }



  getPlayersAtTable() {
    return this.listPlayerIdsAtTable().map(id => {
      return getPlayerById(id, mockPlayers);
    });
  }



  getWinnerOfPot(pot, members) {
    let topRank = 10;
    let topRankId = null;

    members.forEach(member => {
      if (member.currentHand.rank < topRank) {
        topRank = member.currentHand.rank;
        topRankId = member.id;
      }
    });

    pot.winnerId = topRankId;
    return pot;
  }



  handoutStartingChips(startingChips) {

  }



  init(startingChips) {
    this.seatPlayers(playerIds);
    this.handoutStartingChips(startingChips);
  }



  listPlayerIdsAtTable() {
    return this.seats.map(seat => {
      return seat.occupant;
    });
  }



  playHand() {
    this.currentHand.bettors = this.getBetsFromPlayersWithHands();
    //finalTable.refundOverBets(bettors);
    return this.findWinnersOfAllPots(this.createPots(this.currentHand.bettors));
  }



  refundOverBets() {
    //if only one bettor, the blind is the only person in the hand.
    //this can just run through and create a personal pot they won.

    if(this.bettors.length > 1) {

      //find highest bet and id

      //find bet diff next highest bet
      //if bet diff=0, no overpayment
      //else, pay the diff to the id of the highest bettor
    }
  }



  seatPlayers(playerIds) {
    const ids = this.shuffle(playerIds);
    this.seats.filter(seat => {
      return seat.occupant === null;
    }).forEach((emptySeat, index) => {
      emptySeat.occupant = ids[index];
    });
  }
}

module.exports = Table;

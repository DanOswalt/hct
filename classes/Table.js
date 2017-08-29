const SAK = require('./SwissArmyKnife');
const Card = require('./Card');
const PlayerHand = require('./PlayerHand');
const prompt = require('prompt');
const clear = require('clear');


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
    this.activeSeatIndex = this.blindSeatIndex === 5 ? 0 : this.blindSeatIndex + 1;
    this.tournament = opts.tournament;
    this.status = "initializing";
  }

  createNewDeck() {
    const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    const suits = ['c', 'd', 'h', 's'];
    let value = 1;

    //start with empty deck
    this.deck = [];

    ranks.forEach(rank => {
      suits.forEach(suit => {
        this.deck.push({
          name: rank + suit,
          value: value
        });
        value += 1;
      });
    });

    this.shuffle(this.deck);
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

  dealACard() {
    return this.deck.pop();
  }

  dealHand(players) {
    const thisTable = this;
    players.forEach(player => {
      player.currentHand = new PlayerHand(thisTable.dealACard());
    })
  }

  filterPotMembers(players, pot) {
    return players.filter((player) => {
      return pot.members.some((memberId) => {
        return player.id === memberId;
      });
    });
  }

  findWinnersOfAllPots(players, pots) {
    return pots.map((pot) => {
      return this.getWinnerOfPot(pot, this.filterPotMembers(players, pot));
    });
  }

  getBetsFromPlayersWithHands(players) {
    // const players = this.getPlayersAtTable();
    return players.filter(player => {
      return player.currentHand;
    }).map((player) => {
      //console.log(player.currentHand.wager);
      return {
        playerId : player.id,
        chips : player.currentHand.wager
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

  getPlayerById(id, players) {
    for(let i = 0; i < players.length; i += 1 ) {
      if (id === players[i].id) {
        return players[i];
      }
    }
    return -1;
  }

  getPlayersAtTable(allPlayers) {
    return this.listPlayerIdsAtTable().map(id => {
      return this.getPlayerById(id, allPlayers);
    });
  }

  getWagers(players, ante) {
    players.forEach((player, i) => {
      let playerIsThinking = false;

      while(!playerIsThinking) {
        playerIsThinking = true;
        if(player.isHuman && this.blindSeatIndex !== i) {
          //pause and get decision from human
          console.log('hi');
          playerIsThinking = false;
        } else if(this.blindSeatIndex === i) {
          player.call(ante);

          console.log(player.currentHand);
          playerIsThinking = false;
        } else {
          //setInterval here w/ player's delay
          setTimeout(() => {
            player.fold();
            console.log(player.currentHand);
            playerIsThinking = false;
          }, 1000);
        }
      }

    });

    this.setStatus("playerActionsFinished");
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

  handoutStartingChips(startingChips, playersAtTable) {
    playersAtTable.forEach(player => {
      return player.chips = startingChips;
    });
  }

  init(playerIds, startingChips, allPlayers) {
    this.seatPlayers(playerIds);
    const playersAtTable = this.getPlayersAtTable(allPlayers);
    this.handoutStartingChips(startingChips, playersAtTable);
  }

  listPlayerIdsAtTable() {
    return this.seats.map(seat => {
      return seat.occupant;
    });
  }

  playHand(players, ante) {

    //animation of round, everything will be decided immediately for round,
    //but the animation will need to happen slowly,
    //and the human player(s) will need to be paused to wait for decision

    //before animation is created, we can just have the human decide first (unless on blind)

    this.setStatus("playerActionsPending");

    this.createNewDeck();
    this.dealHand(players);
    this.rankHands(players);
    this.getWagers(players, ante);
    //console.log('after wagers:', players);
    //console.log('blindseat:', this.blindSeatIndex);

    this.currentHand.bettors = this.getBetsFromPlayersWithHands(players);
    //this.refundOverBets(bettors);
    //this.subtractWagers();
    return this.findWinnersOfAllPots(players, this.createPots(this.currentHand.bettors));
  }

  rankHands(players) {
    players.sort((a, b) => {a.currentHand.value - b.currentHand.value});
    players.forEach((player, index) => {
      player.currentHand.rank = index + 1;
    })

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

  setStatus(statusString) {
    const oldStatus = this.status;
    this.status = statusString;
    console.log(`${oldStatus} ===> ${this.status}`);
  }

}

module.exports = Table;

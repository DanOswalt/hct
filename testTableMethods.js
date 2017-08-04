const players = require('./mock/players.json');
const Table = require('./Table');
console.log(Table);

const finalTable = new Table({ id : 1 });
console.log(finalTable.seats);

/*
if folded, currentHand will be null

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


//bets is an array of {id, bet}
const createPots = (bets) => {

  //private function to check for equality
  const _betsVary = (bets) => {
    const firstBet = bets[0].chips;
    return bets.some(bet => { return bet.chips !== firstBet });
  };

  //private function to gather bets
  const _getMemberIds = (bets) => {
    return bets.map(bet => {return bet.playerId})
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
  while (_betsVary(bets)) {

    //find smallest common chip value
    let min = 10000000000;
    bets.forEach((bet) => {min = bet.chips > min ? min : bet.chips});

    //create a pot
    pots.push({
      name: potNames.pop(),
      chips: bets.length * min,
      members: bets.map((bet) => {return bet.playerId}),
      winnerId: null
    });

    //subtract min from bets, remove bets with no remaining chips after sidepot
    bets = bets.map(bet => {
      bet.chips -= min;
      return bet;
    }).filter(bet => {
      return bet.chips > 0;
    });
  };

  //create last (or only) pot from remaining bets
  pots.push({
    name: potNames.pop(),
    chips: bets.length * bets[0].chips,
    members: _getMemberIds(bets),
    winnerId: null
  });

  return pots;
}




//members already filtered array of Players
const getWinnerOfPot = (pot, members) => {

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




//return array of pot members, filter to return false if player.id not in member array
const filterPotMembers = (pot, players) => {
  return players.filter((player) => {
    return pot.members.some((memberId) => {
      return player.id === memberId;
    });
  });
}




const getBetsFromPlayersWithHands = (players) => {
  return players.filter((player) => {
    return player.currentHand;
  }).map((player) => {
    return {
      playerId : player.id,
      chips : player.currentHand.bet
    }
  })
}




const refundOverBets = (bets) => {
  //if only one bettor, the blind is the only person in the hand.
  //this can just run through and create a personal pot they won.

  if(bets.length > 1) {

    //find highest bet and id

    //find bet diff next highest bet
    //if bet diff=0, no overpayment
    //else, pay the diff to the id of the highest bettor
  }
}

//new hand
  //(pre-cards)
  //blinds shift
  //order of play shifts
  //(a pause to animate new hands, blind shift)
//deal hand
  //secretly rank players' hands
  //each player decides in/out (blind is forced in)
    //(animate decisions, even though they are already done)
  //func to subtract bet from chips after wager, even if too high
//when all decisions are final...

//gather the bets from players still in the hand
const bettors = getBetsFromPlayersWithHands(players);

//pay back overbets (wager is larger than the other stacks in the pot)
refundOverBets(bettors, players);

//create a pot or pots from the bets
const testPots = createPots(bettors);

//for each pot, find the winner of the pot
const testPotsWithWinners = testPots.map((pot) => {
  const members = filterPotMembers(pot, players);
  const testWin = getWinnerOfPot(pot, members);
  return testWin;
});

//pay out to winners



//remove players with 0 chips

console.dir(testPotsWithWinners);

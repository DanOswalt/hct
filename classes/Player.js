const SAK = require('./SwissArmyKnife');


class Player extends SAK {

  constructor(props) {
    super();
    this.name = props.name;
    this.id = props.id;
    this.currentHand = null;
    this.isHuman = props.isHuman;
    this.callFrequencies = [];
  }

  generateName() {
    this.name = this.randName();
  }

  createCallFrequencies() {
    //creates an array of 52 numbers between 0 and 1
    //each index represents a card value (index + 1)
    //callFrequency[Card.value - 1] = % of time player will call
    //this is to be combined with a player's randomness factor (sometimes they will go crazy and just flip a coin)

    //'decisionsRange is the middling card values that are not auto-fold or auto-call'
    // anything above the decisionRange is 100% call
    // anything below is fold
    // the call frequencies in the decisionRange increase for each step in the range

  	const topOfRange = this.randNum(0, 52);
  	const bottomOfRange = this.randNum(0, topOfRange);
  	const lengthOfRange = topOfRange - bottomOfRange;
  	this.callFrequencies = new Array(52).fill(1);
  	let stepsFromTop;

  	for (var i = 0; i < topOfRange; i++) {
  		if (i < bottomOfRange) {
  			this.callFrequencies[i] = 0;
  		} else if (i >= bottomOfRange && i < topOfRange) {
  			stepsFromTop = topOfRange - i;
  			this.callFrequencies[i] = 1 - (stepsFromTop / lengthOfRange);
  		}
  	};
  }

  /*
  Return simple true/false if a random num is less than the call frequency at that card rank index
  */

  call(ante) {
    this.currentHand.wager = ante > this.chips ? this.chips : ante;
  }

  fold() {
    this.currentHand = null;
  }

  getDecision() {
    const decision = Math.random() < this.callFrequencies[this.currentHand.value - 1];
    console.log(decision);
  	return decision;
  };
}



module.exports = Player;

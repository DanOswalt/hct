//Swiss Army Knife. Or sak of tools.

class SAK {

  //no constructor

  testMe(hello) {
    console.log('knife says:', hello);
  }




  randNum(min,max) {
    return Math.floor(Math.random()*(max-min+1)+min);
  }




  shuffle(array) {
    var counter = array.length;

    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        var index = Math.floor(Math.random() * counter);

        // Decrease counter by 1
        counter--;

        // And swap the last element with it
        var temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }

    return array;
  }




  sum(array) {
    var result = array.reduce(function(a, b) {
      return a + b;
    }, 0);
    return result;
  }




  randName() {
    const chars = this.randNum(3,8);
    const pattern = this.randNum(0,2);
    let word;

    const vowels = ['a','a','a','a','a','a','a','a','a','a',
                 'e','e','e','e','e','e','e','e','e','e',
                 'o','o','o','o','o','o','o','o','o','o',
                 'i','i','i','i','i','u','u','u','u','u',
                 'ae','ai','au','aa','ea','ee','ei','eu','ia','ie',
                 'io','ua','ue','ui','uo','eau','oa','oi','ou','ea'
                ];

    const first_conson = ['B','C','D','F','G','H','J','K','L','M',
                       'N','N','P','Q','R','S','T','V','W','X',
                       'Y','Z','Ch','Sh','Ph','Th','Sh','Str','Sk','Sp',
                       'Kr','Kl','Qu','Fr','Bl','Pl','Tr','Tw','Dr','Br',
                       'Gh','Gr','Gl','Pr','Zh','Fl','Cl','Cr','Chr','Spr',
                       'R','S','T','L','N','R','S','T','L','N'
                      ];

    const other_conson = ['b','c','d','f','g','h','j','k','l','m',
                       'n','n','p','q','r','s','t','u','v','x',
                       'y','z','ch','sh','ph','th','st','str','sk','sp',
                       'ss','tt','qu','mm','nn','gg','tr','rt','lt','ft',
                       'gh','rg','dd','rp','ll','ck','rf','cr','chr','spr',
                       'r','s','t','l','n','r','s','t','l','n'
                      ];

    if(pattern < 2 ) {
      word = first_conson[this.randNum(0,59)] +
             vowels[this.randNum(0,59)] +
             other_conson[this.randNum(0,59)] +
             vowels[this.randNum(0,59)] +
             other_conson[this.randNum(0,59)];

    } else {
      word = vowels[this.randNum(0,59)] +
             other_conson[this.randNum(0,59)] +
             vowels[this.randNum(0,59)] +
             other_conson[this.randNum(0,59)] +
             vowels[this.randNum(0,59)];

      word = this.capitalise(word);
    }

    //lop off at x chars length to keep it non-ridiculous
    word = word.substr(0,chars);

    return word;
  };




  capitalise(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };




}

module.exports = SAK;

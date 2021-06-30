import PokerHandMod from "./index.cjs";

const {PokerHand,Result,ResultLabel} = PokerHandMod
// debug module
function check(expect, player, opponent, msg = '') {
    // var hand = new PokerHand("KS 2H 5C JD TD");
    let hand = new PokerHand(player);
    
    let opp = new PokerHand(opponent)
    let res = hand.compareWith(opp)
    
    console.log()
    console.log('>> ', msg)
    console.log(ResultLabel[res], res, expect, [player, opponent])
    return res;
    
}

function _debug() {
    // let res1
    // res1 = check(
    //     Result.loss,
    //     "6S AD 7H 4S AS",
    //     "AH AC 5H 6H 7S")
    
    // check(Result.win,
    //     "2H 3H 4H 5H 6H",
    //     "AS AD AC AH JD"
    // )
    
    // check(Result.win, "2H 3H 4H 5H 6H", "AS AD AC AH JD");
    // check(Result.win, "AS AH 2H AD AC", "JS JD JC JH 3D");
    // check(Result.win, "AS 3S 4S 8S 2S", "2H 3H 5H 6H 7H","Highest flush wins");
    // check(Result.win, "2S AH 2H AS AC", "2H 3H 5H 6H 7H");
    // check(Result.win, "2H 3H 5H 6H 7H", "2S 3H 4H 5S 6C");
    // check(Result.loss, "2S 2H 4H 5S 4C", "AH AC 5H 6H AS");
    // check(Result.loss, "6S AD 7H 4S AS", "AH AC 5H 6H 7S");
    // check(Result.loss, "2S 3H 6H 7S 9C", "7H 3C TH 6H 9S");
    // check(Result.loss,"[ 13, 5 ]","[ 13, 14 ]");
    // check(Result.win,  '7C 7S KH 2H 7H', '3H 4C 4H 3S 2H');
    // check(Result.win, 'JC 7H JS JD JH', 'JC 6H JS JD JH')
    // check(Result.win, 'KD 6S 9D TH AD', 'JH 8S TH AH QH')
    // check(Result.loss, '4S 5H 6H TS AC', '3S 5H 6H TS AC')
    check(Result.loss, '3S 8S 9S 5S KS', '4C 5C 9C 8C KC')
    // console.log('>')
    // var hand = new PokerHand("KS 2H 5C JD TD");
    // var hand = new PokerHand("6S 6H 5C JD TD");
    // var opp = new PokerHand("5S 5H 5C JD TD")
    // var res = hand.compareWith(opp)
    // console.log(ResultLabel[res])
}

_debug()
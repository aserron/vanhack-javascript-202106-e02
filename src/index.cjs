const Result      = {"win": 1, "loss": 2, "tie": 3};
/**
 * Result value and it's associated string name.
 * @type {{"1": string, "2": string, "3": string}}
 */
const ResultLabel = {
    1: "WIN",
    2: "LOSS",
    3: "TIE"
};

/**
 * All Hand Result Names with its corresponding rank value in descending order.
 * @type {{DoublePair: number, Poker: number, SteelWheel: number, FullHouse: number, OnePair: number, RoyalFlush:
 *     number, Flush: number, FiveOfKind: number, StraightFlush: number, HighCard: number, Straight: number,
 *     ThreeOfKind: number}}
 */
const HandNames = {
    
    // Special only when playing with wildcards.
    FiveOfKind: 0, // AS AD AC AH + Wild Card
    
    // Royal & Straight
    RoyalFlush   : 1, // Same Suit  10 J Q K A
    StraightFlush: 2, // Mixed Suit 4S 5D 6H 7C 8S
    
    SteelWheel: 3, // Like Royal starting with A,2,3,4,5
    
    // Poker
    Poker: 4, // 4 equal , plus last card Value.
    
    // Full House
    FullHouse: 5, // Rank (3) > Rank(2),
    
    // Color
    Flush: 6, // COLOR
    
    // Sequence
    Straight: 7, // escalera, Rank(highest)
    
    // Three of same value
    ThreeOfKind: 8, // pierna, Rank(highest)
    
    DoublePair: 9,
    OnePair   : 10,
    HighCard  : 11, // 5 cartas sin juego.
}


/**
 * Create a new PokerHand instance.
 * @param {string} hand String representation of the hand.
 * @constructor
 */
function PokerHand(hand) {
    
    this._str = hand;
    
    this.order = 'None'
    
    /**
     * @private
     * @type {Array}
     */
    let cardArr = hand.split(' ')
    
    /**
     *
     * @type {Map}
     */
    this.cards = cardArr.reduce((acc, item, i) => {
        
        let [val, suit] = item.split('')
        
        if (!acc.has(val)) acc.set(val, [])
        
        acc.get(val).push(suit)
        
        return acc;
        
    }, new Map())
    
    this.sort()
    
    
    this.calculate();
}

PokerHand.prototype.sort = function (ord = 'DESC') {
    
    if (this.order === ord) return;
    
    this.order = (ord === 'DESC') ? ord : 'ASC';
    
    let mult = (ord === 'DESC') ? -1 : 1;
    
    let cardsArr = [...this.cards.entries()].sort((card1, card2) => {
        
        const valueMap = {"T": 10, "J": 11, "Q": 12, "K": 13, "A": 14}
        
        const v1 = (card1[0] in valueMap) ? valueMap[card1[0]] : card1[0]
        const v2 = (card2[0] in valueMap) ? valueMap[card2[0]] : card2[0]
        
        if (v1 === v2) return 0;
        if (v1 > v2) return (1 * mult);
        if (v1 < v2) return (-1 * mult);
        
    })
    
    this.cards = new Map(cardsArr)
}

/**
 * Card Values List
 *
 * - 2, 3, 4, 5, 6, 7, 8, 9, T(en), J(ack), Q(ueen), K(ing), A(ce)
 * @name PokerHand.prototype.CardList
 * @type {(number|string)[]}
 */
PokerHand.prototype.CardList = [2, 3, 4, 5, 6, 7, 8, 9, 'T', 'J', 'Q', 'K', 'A']

/**
 * Card Suits
 * - S(pades), H(earts), D(iamonds), C(lubs)
 *
 * @type {string[]}
 */
PokerHand.prototype.CardSuit = ["D", "S", "C", "H"]


// RESULT IDENTIFICATION
PokerHand.prototype.result = null;

PokerHand.prototype.getCardValue = function (card1) {
    const valueMap = {"T": 10, "J": 11, "Q": 12, "K": 13, "A": 14}
    return (card1[0] in valueMap) ? valueMap[card1[0]] : parseInt(card1[0])
}

PokerHand.prototype.isStraightFlush = function () {
    
    
    if (this.cards.size !== 5) return false;
    
    const colors = new Set();
    
    let keysArr = [...this.cards.keys()];
    
    let prev = null;
    for (let i = keysArr.length - 1; i > -1; i--) {
        
        let curr = keysArr[i];
        let val  = this.getCardValue(curr)
        
        colors.add(...this.cards.get(curr).values());
        
        if (prev === null) {
            prev = val;
            continue;
        }
        
        prev = prev + 1;
        if ((val - prev) !== 0) return false;
        
    }
    
    if (colors.size !== 1) {
        return false
        console.warn('deben tener el mismo color')
    }
    
    return true;
    
}


/**
 * @todo Implement
 * @return {boolean}
 */
PokerHand.prototype.isRoyal = function () {
    return false;
}

/**
 * All same color
 * @return {boolean}
 */
PokerHand.prototype.isFlush = function () {
    if (this.cards.size !== 5) return false;
    let s1 = [...this.cards.values()].reduce((acc, set) => acc.add(...set), new Set())
    return (s1.size === 1)
}

/**
 *
 * @return {boolean} True if 4 suits for value present.
 */
PokerHand.prototype.isPocker = function () {
    
    return [...this.cards.values()].some(function (set, index, array) {
        return (set.length === 4)
    })
}

/**
 * @return {boolean} True if 3 of a kind and a pair present
 */
PokerHand.prototype.isFullHouse = function () {
    return (this.cards.size === 2);
}

/**
 *
 * @return {boolean} True if a sequence of values present.
 */
PokerHand.prototype.isStraight = function () {
    let arr = [...this.cards.entries()];
    
    let prev = null;
    for (let i = arr.length - 1; i > -1; i--) {
        
        let [curr, set] = arr[i];
        let val         = this.getCardValue(curr)
        
        
        if (set.length !== 1) return false;
        
        if (prev === null) {
            prev = val;
            continue;
        }
        
        prev = prev + 1;
        if ((val - prev) !== 0) return false;
        
    }
    return true;
}

PokerHand.prototype.isThreeOfKind = function () {
    if (this.cards.size !== 3) return false;
    
    return [...this.cards.entries()].some((item, idx) => {
        let [card, set] = item;
        return (set.length === 3)
    });
}

PokerHand.prototype.isDoublePair = function () {
    if (this.cards.size !== 3) return false;
    
    return [...this.cards.entries()].every((item, idx) => {
        let [card, set] = item;
        return (set.length === 2) || (set.length === 1)
    });
}

PokerHand.prototype.isPair = function () {
    
    return [...this.cards.values()].some(set => {
        return (
            (set.length >= 2) &&
            (set.length < 4)
        )
    })
    
}

/**
 * Sets the result with its name and rank by name.
 * @param {string} param HandNames property name.
 */
PokerHand.prototype.setResult = function (param) {
    this.result = {
        rank: HandNames[param],
        name: param
    }
}

/**
 * Calculate the result the hand.
 */
PokerHand.prototype.calculate = function () {
    
    /**
     * @type {PokerHand!}
     */
    let hand = this;
    
    
    if (hand.isStraightFlush() && hand.isRoyal()) {
        
        hand.setResult('RoyalFlush')
        
    } else if (hand.isStraightFlush()) {
        hand.setResult('StraightFlush')
    } else if (hand.isPocker()) {
        hand.setResult('Poker')
    } else if (hand.isFullHouse()) {
        hand.setResult('FullHouse')
    } else if (hand.isFlush()) {
        hand.setResult('Flush')
    } else if (hand.isStraight()) {
        hand.setResult('Straight')
    } else if (hand.isThreeOfKind()) {
        hand.setResult('ThreeOfKind')
    } else if (hand.isDoublePair()) {
        hand.setResult('DoublePair')
    } else if (hand.isPair()) {
        hand.setResult('OnePair')
    } else {
        hand.setResult('HighCard')
    }
    
}


// RESULT VALUE CALCULATION

/**
 * Get the hand value usign specific calculator for each result in hand.
 * @return {number|*}
 */
PokerHand.prototype.getHandValue = function () {
    
    let target = `${this.result.name}`;
    
    let fn = (this.Calculator.hasOwnProperty(target)) ? this.Calculator[target] : false;
    
    if (!fn) {
        console.warn("fn for getHandValue NOT FOUND", this.result.name, this.Calculator);
        return -1;
    }
    return fn.call(this);
}

/**
 * CARD VALUE CALCULATION Object.
 * Ensure correct calculation of value, usign a strategy pattern.
 *
 * An object with HandName:Function pairs.
 *
 * @type {{OnePair: (function(): *)}}
 */
PokerHand.prototype.Calculator = {
    
    StraightFlush: function () {
        return this.getCardValue([...this.cards.keys()][0])
    },
    Straight     : function () {
        return this.getCardValue([...this.cards.keys()][0])
    },
    
    Poker: function () {
        let final = [...this.cards.entries()].reduce((acc, item, idx) => {
            let [card, set] = item
            
            let cardValuer = this.getCardValue(card);
            
            if (set.length === 4) {
                acc += (cardValuer * Math.pow(10, 3))
            } else {
                acc += (cardValuer)
            }
            return acc;
        }, 0)
        
        return final;
    },
    
    FullHouse: function () {
        
        let final = [...this.cards.entries()].reduce(
            (acc, item, i, array) => {
                let [card, set] = item;
                
                if (set.length === 3) {
                    acc = acc + (this.getCardValue(card) * 3 * 100)
                } else {
                    acc = acc + (this.getCardValue(card) * 100)
                    
                }
                return acc
            }, 0)
        
        return final;
        
    },
    
    Flush: function () {
        
        let count = 5;
        let final = [...this.cards.entries()].reduce(
            (acc, item, i, array) => {
                let [card, set] = item;
                
                acc = acc + (this.getCardValue(card) * Math.pow(count, 20))
                count--
                
                return acc
            }, 0)
        
        return final
    },
    
    ThreeOfKind: function () {
        
        let final = 0;
        
        let valuesArr = [...this.cards.entries()].reduce(
            (acc, entry, index) => {
                
                let [card, set] = entry;
                
                let cardValue = this.getCardValue(card)
                
                if (set.length === 3) {
                    final += (cardValue * Math.pow(100, 3))
                } else {
                    acc.push(cardValue)
                }
                return acc;
                
            }, [])
        
        valuesArr.sort((a, b) => b - a)
        
        let count = 2;
        final += valuesArr.reduce((acc, value, i) => {
            
            acc = acc + (value * (Math.pow(100, count)))
            count--
            
            return acc
        }, 0)
        
        console.log(`ThreeOfKind:${final} arr=`, valuesArr)
        
        
        return final
    },
    DoublePair : function () {
        
        let final = 0;
        
        let valuesArr = [...this.cards.entries()].reduce(
            (acc, entry, index) => {
                
                let [card, set] = entry;
                
                if (set.length === 2) {
                    let cardValue = this.getCardValue(card)
                    acc.push(cardValue)
                } else {
                    final = final + this.getCardValue(card)
                }
                return acc;
                
            }, [])
        
        
        valuesArr.sort((a, b) => b - a)
        
        let count = 3;
        final += valuesArr.reduce((acc, value, i) => {
            
            acc = acc + (value * (Math.pow(100, count)))
            count--
            
            return acc
        }, 0)
        
        console.log(`DoublePair:${final} arr=`, valuesArr)
        
        
        return final
    },
    
    OnePair: function () {
        
        // find the next highest card in
        // create a number like primary*10 + secondary
        //      [val pair][val max single card][..][..][..]
        //
        // normaliza la herarquia a natural que siempre estan ordenados
        let count = 4;
        let final = [...this.cards.entries()].reduce(
            (acc, item, i, array) => {
                let [card, set] = item;
                
                let cardValue = this.getCardValue(card);
                
                if (set.length === 2) {
                    acc = acc + (cardValue * (Math.pow(100, 5)))
                } else {
                    acc = acc + (cardValue * (Math.pow(100, count)))
                    count--
                }
                return acc
            }, 0)
        
        console.log('[OnePair] Value:', final, ' str=', this._str)
        
        return final;
        
        
    },
    
    HighCard: function () {
        
        // find the next highest card in
        // create a number like primary*10 + secondary
        //      [val pair][val max single card][..][..][..]
        //
        // normaliza la herarquia a natural que siempre estan ordenados
        let count = 5;
        let final = [...this.cards.entries()].reduce(
            (acc, item, i, array) => {
                let [card, set] = item;
                
                acc = acc + (this.getCardValue(card) * Math.pow(count, 20))
                count--
                
                return acc
            }, 0)
        
        return final
    }
    
    
} // eo Calculator


// COMPARE WITH OTHER HAND


/**
 * Compare this rank with the one of passed hand.
 *
 *  1 - comparo rank de la mano
 *      1.1 - diff, defino ganador
 *      1.2 - iguales, busco desempatar con valor
 *  2 - comparo valor de mano, returno el ganador
 
 * @param {PokerHand} hand
 * @return {number} 1 if rank > hand, 0 if equals, -1 otherwise.
 */
PokerHand.prototype.compareHandRank = function (hand) {
    if (this.result.rank === hand.result.rank) {
        return 0
    } else if (this.result.rank < hand.result.rank) {
        return 1
    } else {
        return -1
    }
}

/**
 * Compare this hand value with passed hand's value.
 *
 * @param {PokerHand} hand Must have the same result as this.
 *
 * @return {number} 1 if this value > hand's value, 0 if equals, -1 otherwise.
 */
PokerHand.prototype.compareHandValue = function (hand) {
    
    let my  = this.getHandValue()
    let opp = hand.getHandValue()
    
    if (my === opp) {
        return 0
    } else if (my > opp) {
        return 1
    } else {
        return -1
    }
}

/**
 * Compare this PokerHand against a passed hand.
 * - First they are compared by hand rank,
 * - if match, they compare hand value.
 *
 * @param {PokerHand} hand Competitors hand to compare with.
 * @returns {number}  1 if this hand wons, 0 if equals, -1 loose.
 */
PokerHand.prototype.compareWith = function (hand) {
    
    console.log("compareWith ", [this._str, hand._str])
    console.log()
    
    if (this.compareHandRank(hand) > 0) return Result.win;
    if (this.compareHandRank(hand) < 0) return Result.loss;
    
    // this.compareHandRank(hand) === 0
    
    let value1 = this.compareHandValue(hand);
    
    if (value1 === 0) return Result.tie;
    if (value1 > 0) return Result.win;
    if (value1 < 0) return Result.loss;
    
}


module.exports = {
    PokerHand: PokerHand,
    Result   : Result,
    ResultLabel: ResultLabel
};
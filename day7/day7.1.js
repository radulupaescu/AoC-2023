const fs = require('fs');
const path = require('path');

const sym = {
    '2': 2,
    '3': 3,
    '4': 4,
    '5': 5,
    '6': 6,
    '7': 7,
    '8': 8,
    '9': 9,
    T: 10,
    J: 11,
    Q: 12,
    K: 13,
    A: 14,
};

fs.readFile(path.join(__dirname, 'day7.input'), 'utf8', (err, data) => {
    let hands = [];

    data.split("\n").forEach((game) => {
        let [hand, bid] = game.split(' ');
        bid = parseInt(bid);
        const freq = hand.split('').reduce((freq, card) => {
            freq[card] ? freq[card]++ : freq[card] = 1;

            return freq;
        }, {});

        hands.push({
            count: Object.keys(freq).length,
            type: Object.keys(freq).reduce((max, key) => max >= freq[key] ? max : freq[key] , 0),
            freq,
            hand,
            bid,
        });
    });

    hands = hands.sort((a, b) => {
        if (a.count < b.count) { return 1; }
        if (a.count > b.count) { return -1; }
        if (a.type > b.type) { return  1; }
        if (a.type < b.type) { return  -1; }

        let ret = 0;
        for (let i = 0; i < a.hand.length; i++) {
            if (a.hand[i] === b.hand[i]) {
                continue;
            }

            if (sym[a.hand[i]] > sym[b.hand[i]]) {
                return 1;
            } else {
                return -1;
            }
        }

        return 0;
    });

    const winnings = hands.map((hand, rank) => (rank + 1) * hand.bid).reduce((sum, value) => sum += value);

    console.log(winnings);
});
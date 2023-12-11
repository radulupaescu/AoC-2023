const fs = require('fs');
const path = require("path");

fs.readFile(path.join(__dirname, 'day4.input'), 'utf8', (err, data) => {
    let sum = 0;
    const cards = [];
    const winners = [];
    let i = 0;
    data.split("\n").forEach((rawCardData) => {
        cards[i] = 1;
        const card = rawCardData
            .replaceAll(': ', ':')
            .split(':')[1]
            .replaceAll('  ', ' ')
            .replaceAll(' | ', '|')
            .split('|')
        ;

        const winning = card[0].split(' ').filter(number => number !== '').map(value => parseInt(value));
        const have = card[1].split(' ').filter(number => number !== '').map(value => parseInt(value));

        let cardValue = 0;
        have.forEach((value) => {
            if (winning.includes(value)) {
                cardValue++;
            }
        });

        winners[i] = cardValue;

        i++;
    });

    winners.forEach((value, index) => {
        for (let i = index + 1; i <= index + value; i++) {
            cards[i] += cards[index];
        }
    });

    sum = cards.reduce((total, count) => total += count, 0);

    console.log(sum);
});
const fs = require('fs');
const path = require("path");

fs.readFile(path.join(__dirname, 'day4.input'), 'utf8', (err, data) => {
    let sum = 0;
    data.split("\n").forEach((rawCardData) => {
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

        if (cardValue > 0) {
            sum += Math.pow(2, cardValue - 1);
        }
    });

    console.log(sum);
});
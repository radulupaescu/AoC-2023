const fs = require('fs');
const path = require('path');

const available = {
    'r': 12,
    'g': 13,
    'b': 14,
};

fs.readFile(path.join(__dirname, 'day2.input'), 'utf8', (err, data) => {
    let sum = 0;
    let index = 0;
    data.split("\n").forEach((game) => {
        index++;
        let possible = true;
        game.replaceAll('Game', '')
            .replaceAll(' ', '')
            .replaceAll('blue', 'b')
            .replaceAll('green', 'g')
            .replaceAll('red', 'r')
            .split(':')[1]
            .split(';')
            .forEach((round) => {
                let seen = {
                    'r': 0,
                    'g': 0,
                    'b': 0,
                };
                round.split(',').forEach((pair) => {
                    seen[pair[pair.length - 1]] = parseInt(pair.substring(0, pair.length - 1));
                });

                if (seen['r'] > available['r'] || seen['g'] > available['g'] || seen['b'] > available['b']) {
                    possible = false;
                }
            });

        if (possible) {
            sum += index;
        }
    });

    console.log(sum);
});

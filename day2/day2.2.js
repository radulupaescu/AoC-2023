const fs = require('fs');
const path = require("path");

fs.readFile(path.join(__dirname, 'day2.input'), 'utf8', (err, data) => {
    let sum = 0;
    let index = 0;
    data.split("\n").forEach((game) => {
        index++;

        let min = {
            'r': 0,
            'g': 0,
            'b': 0,
        };

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

                min['r'] = min['r'] > seen['r'] ? min['r']: seen['r'];
                min['g'] = min['g'] > seen['g'] ? min['g']: seen['g'];
                min['b'] = min['b'] > seen['b'] ? min['b']: seen['b'];
            });

        sum += min['r'] * min['g'] * min['b'];
    });

    console.log(sum);
});

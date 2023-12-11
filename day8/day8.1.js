const fs = require('fs');
const path = require("path");

fs.readFile(path.join(__dirname, 'day8.input'), 'utf8', (err, data) => {
    let instructions;
    let map = {};

    data.split("\n").forEach((line, index) => {
        if (line === '') { return; }
        if (index === 0) {
            instructions = line;

            return;
        }

        let lr = line.replaceAll(' ', '').replaceAll('(', '').replaceAll(')', '').split('=');
        const key = lr[0];
        lr = lr[1].split(',');

        map[key] = {
            L: lr[0],
            R: lr[1],
        };
    });

    let steps = 0;
    let pos = 'AAA';
    while (pos !== 'ZZZ') {
        pos = map[pos][instructions[steps % instructions.length]];
        steps++;
    }

    console.log(steps);
});

const fs = require('fs');
const path = require('path');

fs.readFile(path.join(__dirname, 'day8.input'), 'utf8', (err, data) => {
    let instructions;
    let map = {};
    let positions = [];
    let steps = [];

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

        if (key[2] === 'A') {
            positions.push(key);
        }
    });

    for (let track = 0; track < positions.length; track++) {
        let pos = positions[track];
        steps[track] = 0;
        while (pos[2] !== 'Z') {
            pos = map[pos][instructions[steps[track] % instructions.length]];
            steps[track]++;
        }
    }

    let multiple = steps[0];
    steps.forEach(function(n) {
        multiple = lcm(multiple, n);
    });

    console.log(multiple);
});

const gcd = (a, b) => {
    return !b ? a : gcd(b, a % b);
};

const lcm = (a, b) => {
    return (a * b) / gcd(a, b);
};

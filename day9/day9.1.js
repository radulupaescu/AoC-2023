const fs = require('fs');
const path = require('path');

fs.readFile(path.join(__dirname, 'day9.input'), 'utf8', (err, data) => {
    let sum = 0;
    data.split("\n").forEach((line, index) => {
        const values = line.split(' ').map((value) => parseInt(value));

        sum += values[values.length - 1] + reduce(values);
    });

    console.log(sum);
});

const reduce = (values) => {
    const reduced = [];
    let allZeroes = true;
    for (let i = 0; i < values.length - 1; i++) {
        const diff = values[i + 1] - values[i];
        if (diff !== 0) {
            allZeroes = false;
        }

        reduced.push(diff);
    }

    let diff = 0;
    if (!allZeroes) {
        diff = reduce(reduced);
    }

    return reduced[reduced.length - 1] + diff;
};
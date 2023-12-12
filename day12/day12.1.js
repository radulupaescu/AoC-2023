const fs = require('fs');
const path = require("path");

fs.readFile(path.join(__dirname, 'day12.input'), 'utf8', (err, data) => {
    let sum = 0;

    data.split("\n").forEach((line ) => {
        let [pattern, counters] = line.split(' ');
        counters = counters.split(',').map(val => parseInt(val));

        sum += search(pattern, counters);
    });

    console.log(sum);
});

const search = (pattern, counters) => {
    if (pattern === '') {
        return counters.length === 0 ? 1 : 0;
    }

    if (pattern[0] === '.') {
        return search(pattern.substring(1), counters);
    } else if (pattern[0] === '?') {
        return search('#' + pattern.substring(1), counters) + search('.' + pattern.substring(1), counters);
    } else if (pattern[0] === '#') {
        const needed = makePounds(counters[0]);
        const have = pattern.substring(0, counters[0]).replaceAll('?', '#');

        if (needed === have) {
            if (needed.length < pattern.length) {
                if (pattern[needed.length] === '#') {
                    return 0;
                }

                if (pattern[needed.length] === '?') {
                    pattern = pattern.substring(0, needed.length) + '.' + pattern.substring(needed.length + 1);
                }
            }

            return search(pattern.substring(needed.length), counters.slice(1));
        } else {
            return 0;
        }
    }
};

const makePounds = (len) => {
    if (!len) { len = 0; }
    return new Array(len + 1).join('#');
};
const fs = require('fs');
const path = require("path");

fs.readFile(path.join(__dirname, 'day12.input'), 'utf8', (err, data) => {
    let sum = 0;
    let index = 0;
    const startTime = new Date().getTime();

    data.split("\n").forEach((line ) => {
        const iterStart = new Date().getTime();
        index++;
        let [pattern, counters] = line.split(' ');
        counters = counters.split(',').map(val => parseInt(val));

        pattern = `${pattern}?${pattern}?${pattern}?${pattern}?${pattern}`;
        counters = [...counters, ...counters, ...counters, ...counters, ...counters];

        sum += search(pattern, counters);

        const iterEnd = new Date().getTime();

        console.log(`completed ${index} in ${iterEnd - iterStart} ms`);
    });

    const endTime = new Date().getTime();
    console.log(`finished in ${endTime - startTime} ms`);

    console.log(sum);
});

const cache = new Map();

const search = (pattern, counters) => {
    const key = `${pattern};${counters.join(',')}`;
    const seen = cache.get(key);
    if (seen !== undefined) {
        return seen;
    }

    if (pattern === '') {
        return counters.length === 0 ? 1 : 0;
    }

    if (pattern[0] === '.') {
        const arrangements = search(pattern.substring(1), counters);
        cache.set(key, arrangements);
        return arrangements;
    } else if (pattern[0] === '?') {
        const arrangements = search('#' + pattern.substring(1), counters) + search('.' + pattern.substring(1), counters);
        cache.set(key, arrangements);
        return arrangements;
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

            const arrangements = search(pattern.substring(needed.length), counters.slice(1));
            cache.set(key, arrangements);
            return arrangements;
        } else {
            return 0;
        }
    }
};

const makePounds = (len) => {
    if (!len) { len = 0; }
    return new Array(len + 1).join('#');
};
const fs = require('fs');
const path = require("path");

const mapKeys = [
    'seed-to-soil map:',
    'soil-to-fertilizer map:',
    'fertilizer-to-water map:',
    'water-to-light map:',
    'light-to-temperature map:',
    'temperature-to-humidity map:',
    'humidity-to-location map:',
];

const maps = [
    [],
    [],
    [],
    [],
    [],
    [],
    [],
];

let seeds;

fs.readFile(path.join(__dirname, 'day5.input'), 'utf8', (err, data) => {
    let mapIndex = -1;
    data.split("\n").forEach((line) => {
        if (line === '') { return; }
        if (line.substring(0, 6) === 'seeds:') {
            seeds = line.split(': ')[1].split(' ').map((value) => parseInt(value));
            return;
        }

        if (mapKeys.includes(line)) {
            mapIndex++;
            return;
        }

        maps[mapIndex].push({
            dst: parseInt(line.split(' ')[0]),
            src: parseInt(line.split(' ')[1]),
            len: parseInt(line.split(' ')[2]),
        });
    });

    maps.forEach((map, index) => {
        maps[index] = map.sort((a, b) => a.src - b.src);
    });

    let minLocation = 99999999999;
    for (let seed of seeds) {
        const location = processSeed(seed);
        if (location < minLocation) {
            minLocation = location;
        }
    }

    console.log(minLocation);
});

const processSeed = (seed) => {
    let translated = seed;
    for (let map of maps) {
        translated = translate(map, translated);
    }

    return translated;
};

const translate = (map, value) => {
    for (let i = 0; i < map.length; i++) {
        if (value >= map[i].src && value < map[i].src + map[i].len) {
            return map[i].dst + (value - map[i].src);
        }
    }

    return value;
}


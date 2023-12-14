const fs = require('fs');
const path = require('path');
const { createHash} = require('crypto');

fs.readFile(path.join(__dirname, 'day14.input'), 'utf8', (err, data) => {
    let platform = [];
    let hash;
    let seenCounter = 1;

    const seenAt = new Map();
    const seen = new Map();
    const counterMap = new Map();

    data.split("\n").forEach((line) => {
        platform.push(line.split(''));
    });

    platform = tilt(rotate(platform));
    hash = hashPlatform(platform);

    while (seenCounter < 100 || !seen.has(hash)) {
        let load = beamLoad(platform, (seenCounter - 1));
        seen.set(hash, load);
        seenAt.set(hash, seenCounter);

        counterMap.set(seenCounter, hash);
        seenCounter++;

        platform = tilt(rotate(platform));

        hash = hashPlatform(platform);
    }

    let cycleLength = seenCounter - seenAt.get(hash);
    let before = seenCounter - cycleLength - 1;

    console.log(seen.get(counterMap.get(before + ((4000000000 - before) % cycleLength ))));
});

const rotate = (platform) => {
    const rotated = [];

    for (let j = 0; j < platform[0].length; j++) {
        rotated[j] = [];
        for (let i = platform.length - 1; i > -1 ; i--) {
            rotated[j].push(platform[i][j]);
        }
    }

    return rotated;
};

const tiltRow = (row) => {
    const tilted = [];
    const reversed = row.reverse();
    let i = 0;
    while (i < reversed.length) {
        if (reversed[i] === '#') {
            tilted.push('#');
            i++;
        }

        let round = 0;
        let empty = 0;
        while (reversed[i] !== '#' && i < reversed.length) {
            if (reversed[i] === 'O') { round++; } else { empty++; }
            i++;
        }

        for (let j = 0; j < round; j++) {
            tilted.push('O');
        }

        for (let j = 0; j < empty; j++) {
            tilted.push('.');
        }
    }

    return tilted.reverse();
}

const tilt = (platform) => {
    const tilted = [];

    for (let r = 0; r < platform.length; r++) {
        tilted.push(tiltRow(platform[r]));
    }

    return tilted;
}

const beamLoad = (platform, rotations) => {
    let temp = platform;
    for (let i = 0; i < (4 - (rotations % 4)) % 4; i++) {
        temp = rotate(temp);
    }

    let load = 0;
    for (let i = 0; i < temp.length; i++) {
        for (let j = temp[i].length; j > 0; j--) {
            if (temp[i][j - 1] === 'O') { load += j; }
        }
    }

    return load;
};

const hashPlatform = (platform) => {
    const strPlatform = platform.map((row) => row.join('')).join('');
    const hash = createHash('sha256');
    hash.update(strPlatform);

    return hash.digest('hex');
};

const print = (platform) => {
    console.log('----------------');
    const toPrint = [];
    for (let i = 0; i < platform.length; i++) {
        toPrint.push(platform[i].join(''));
    }
    console.log(toPrint.join("\n"));
    console.log('----------------');
};
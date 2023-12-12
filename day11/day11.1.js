const fs = require('fs');
const path = require("path");

fs.readFile(path.join(__dirname, 'day11.input'), 'utf8', (err, data) => {
    const universe = [];
    const galaxiesOnLine = [];
    const galaxiesPos = [];
    let galaxiesDist = 0;
    let galaxiesOnCol = [];

    data.split("\n").forEach((line) => {
        universe.push(line.split(''));
    });

    // count galaxies on lines and cols
    for (let i = 0; i < universe.length; i++) {
        for (let j = 0; j < universe[0].length; j++) {
            if (galaxiesOnLine[i] === undefined) {
                galaxiesOnLine[i] = 0;
            }

            if (galaxiesOnCol[j] === undefined) {
                galaxiesOnCol[j] = 0;
            }

            if (universe[i][j] === '#') {
                galaxiesOnLine[i] += 1;
                galaxiesOnCol[j] += 1;
            }
        }
    }

    // index galaxies in universe
    for (let i = 0; i < universe.length; i++) {
        for (let j = 0; j < universe[0].length; j++) {
            if (universe[i][j] === '#') {
                galaxiesPos.push([i, j]);
            }
        }
    }

    // compute distances
    for (let i = 0; i < galaxiesPos.length; i++) {
        for (let j = i + 1; j < galaxiesPos.length; j++) {
            const [ x1, y1 ] = galaxiesPos[i];
            const [ x2, y2 ] = galaxiesPos[j];

            const extraLines = getExtras(x1, x2, galaxiesOnLine);
            const extraCols = getExtras(y1, y2, galaxiesOnCol);

            galaxiesDist += Math.abs(x1 - x2) + extraLines + Math.abs(y1 - y2) + extraCols;
        }
    }

    console.log(galaxiesDist);
});

const getExtras = (a, b, counters) => {
    let extra = 0;
    if (a > b) {
        let temp = a;
        a = b;
        b = temp;
    }

    for (let i = a; i <= b; i++) {
        if (counters[i] === 0) {
            extra++;
        }
    }

    return extra;
}

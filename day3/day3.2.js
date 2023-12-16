const fs = require('fs');
const path = require('path');

let engine;

fs.readFile(path.join(__dirname, 'day3.input'), 'utf8', (err, data) => {
    engine = data.split("\n");
    engine.forEach((line, index) => {
        engine[index] = line.split('');
    });

    const starMap = {};
    let sum = 0;

    let i, j;
    for (i = 0; i < engine.length; i++) {
        for (j = 0; j < engine[i].length; j++) {
            let code = '';
            let near = [];
            if (engine[i][j].match(/[0-9]/)) {
                code += engine[i][j];
                near.push(nearStar(i, j));
                j++;
                while (j < engine[i].length && engine[i][j].match(/[0-9]/)) {
                    code += engine[i][j];
                    near.push(nearStar(i, j));
                    j++;
                }
            }

            near = near.filter((starPos, index) => {
                return near.indexOf(starPos) === index;
            }).filter((starPos) => starPos !== null);

            if (near.length > 0) {
                near.forEach((starPos) => {
                    if (!starMap[starPos]) {
                        starMap[starPos] = [];
                    }

                    starMap[starPos].push(parseInt(code));
                });
            }
        }
    }

    Object.keys(starMap).forEach((starPosIndex) => {
        if (starMap[starPosIndex].length === 2) {
            sum += starMap[starPosIndex][0] * starMap[starPosIndex][1];
        }
    });

    console.log(sum);
});

const nearStar = (l, c) => {
    const maxI = engine.length, maxJ = engine[0].length;
    for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
            if (l + i > -1 && l + i < maxI && c + j > -1 && c + j < maxJ) {
                if (engine[l + i][c + j] === '*') {
                    return `${l + i}:${c + j}`;
                }
            }
        }
    }

    return null;
};

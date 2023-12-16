const fs = require('fs');
const path = require('path');

let engine;

fs.readFile(path.join(__dirname, 'day3.input'), 'utf8', (err, data) => {
    let sum = 0;
    engine = data.split("\n");
    engine.forEach((line, index) => {
        engine[index] = line.split('');
    });

    let i, j;
    for (i = 0; i < engine.length; i++) {
        for (j = 0; j < engine[i].length; j++) {
            let code = '';
            let near = false;
            if (engine[i][j].match(/[0-9]/)) {
                code += engine[i][j];
                near = near || nearSymbol(i, j);
                j++;
                while (j < engine[i].length && engine[i][j].match(/[0-9]/)) {
                    code += engine[i][j];
                    near = near || nearSymbol(i, j);
                    j++;
                }
            }

            if (near) {
                sum += parseInt(code);
            }
        }
    }

    console.log(sum);
});

const nearSymbol = (l, c) => {
    const maxI = engine.length, maxJ = engine[0].length;
    for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
            if (l + i > -1 && l + i < maxI && c + j > -1 && c + j < maxJ) {
                if (engine[l + i][c + j] !== '.' && !engine[l + i][c + j].match(/[0-9]/)) {
                    return true;
                }
            }
        }
    }

    return false;
};
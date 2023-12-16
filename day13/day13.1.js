const fs = require('fs');
const path = require('path');

const mirrors = [[]];

fs.readFile(path.join(__dirname, 'day13.input'), 'utf8', (err, data) => {
    let mirror = 0;
    let sum = 0;

    data.split("\n").forEach((line, index) => {
        if (line !== '') {
            mirrors[mirror].push(line.split(''));
        } else {
            mirror++;
            mirrors[mirror] = [];
        }
    });

    mirrors.forEach((mirror) => {
        const type = search(mirror);
        if (type.type === 'v') {
            sum += type.count;
        } else {
            sum += 100 * type.count;
        }
    });

    console.log(sum);
});

const search = (mirror) => {
    const r = mirror.length;
    const c = mirror[0].length;
    const mirrorCoords = {
        type: null,
        count: 0,
    };
    
    // search cols
    for (let j = 1; j < c; j++) {
        let offset = 1;
        while (j - offset > -1 && j + offset - 1 < c && mirror[0][j - offset] === mirror[0][j + offset - 1]) {
            offset++;
        }
        
        if (j - offset === -1 || j + offset - 1 === c) {
            let isMirror = true;
            for (let i = 1; i < r; i++) {
                for (let o = 1; o < offset; o++) {
                    if (mirror[i][j - o] !== mirror[i][j + o - 1]) {
                        isMirror = false;
                    }
                }
            }
            
            if (isMirror && (mirrorCoords.type === null || mirrorCoords.count < j)) {
                mirrorCoords.type = 'v';
                mirrorCoords.count = j;
            }
        }
    }
    
    // search rows
    for (let i = 1; i < r; i++) {
        let offset = 1;
        while (i - offset > -1 && i + offset - 1 < r && mirror[i - offset][0] === mirror[i + offset - 1][0]) {
            offset++;
        }

        if (i - offset === -1 || i + offset - 1 === r) {
            let isMirror = true;
            for (let j = 1; j < c; j++) {
                for (let o = 1; o < offset; o++) {
                    if (mirror[i - o][j] !== mirror[i + o - 1][j]) {
                        isMirror = false;
                    }
                }
            }

            if (isMirror && (mirrorCoords.type === null || mirrorCoords.count < i)) {
                mirrorCoords.type = 'h';
                mirrorCoords.count = i;
            }
        }
    }

    return mirrorCoords;
}

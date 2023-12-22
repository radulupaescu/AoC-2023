const fs = require('fs');
const path = require('path');

let pieces = [];
let maxX = 0;
let maxY = 0;

fs.readFile(path.join(__dirname, 'day22.input'), 'utf8', (err, data) => {
    data.split("\n").forEach((line) => {
        const piece = line.split('~').map(corner => corner.split(',').map(coord => parseInt(coord))).reduce((brick, coords, index) => {
            const point =  {x: coords[0], y: coords[1], z: coords[2]};
            if (!brick['c1']) {
                brick['c1'] = { ...point };
            } else {
                if (brick['c1'].z > point.z) {
                    brick['c2'] = { ...brick['c1'] };
                    brick['c1'] = { ...point };
                } else {
                    brick['c2'] = { ...point };
                }
            }

            return brick;
        }, {});

        if (piece.c1.x > maxX) { maxX = piece.c1.x; }
        if (piece.c2.x > maxX) { maxX = piece.c2.x; }
        if (piece.c1.y > maxY) { maxY = piece.c1.y; }
        if (piece.c2.y > maxY) { maxY = piece.c2.y; }

        pieces.push(piece);
    });

    pieces = pieces.sort((p1, p2) => {
        if (p1.c2.z > p2.c2.z) {
            return 1;
        } else if (p1.c2.z < p2.c2.z) {
            return -1;
        } else {
            return 0;
        }
    });
    maxX += 1;
    maxY += 1;

    const laidPieces = process(pieces).sort((p1, p2) => {
        if (p1.c2.z > p2.c2.z) {
            return 1;
        } else if (p1.c2.z < p2.c2.z) {
            return -1;
        } else {
            return 0;
        }
    });

    // console.log(laidPieces);

    let max = 0;
    for (let i = 0; i < pieces.length; i++) {
        const result = process(laidPieces, i);

        // console.log(`piece ${i}: `, result);

        max += result;
    }

    console.log(max);
});




const process = (origPieces, shoot = -1) => {
    const pieces = [];
    for (let i = 0; i < origPieces.length; i++) {
        pieces.push({ c1: { ...origPieces[i].c1 }, c2: { ...origPieces[i].c2 },});
    }

    let ground = [];
    let falling = 0;

    for (let i = 0; i < maxX; i++) {
        ground[i] = [];
        for (let j = 0; j < maxY; j++) {
            ground[i][j] = 0;
        }
    }

    for (let p = 0; p < pieces.length; p++) {
        if (p === shoot) { continue; }
        let h = 0;
        const piece = { ...pieces[p] };
        for (let i = piece.c1.x; i <= piece.c2.x; i++) {
            for (let j = piece.c1.y; j <= piece.c2.y; j++) {
                if (ground[i][j] > h) {
                    h = ground[i][j];
                }
            }
        }

        for (let i = piece.c1.x; i <= piece.c2.x; i++) {
            for (let j = piece.c1.y; j <= piece.c2.y; j++) {
                ground[i][j] = h + piece.c2.z - piece.c1.z + 1;
            }
        }

        if (shoot > -1 && (piece.c1.z !== h + 1) ) {
            falling++;
        }

        const delta = piece.c2.z - piece.c1.z;
        piece.c1.z = h + 1;
        piece.c2.z = piece.c1.z + delta;

        pieces[p] = piece;
    }

    if (shoot > -1) {
        return falling;
    }

    return pieces;
};





const process2 = (pieces, shoot = -1) => {
    let ground = [];
    let fallingPieces = 0;

    for (let i = 0; i < maxX; i++) {
        ground[i] = [];
        for (let j = 0; j < maxY; j++) {
            ground[i][j] = 0;
        }
    }

    for (let p = 0; p < pieces.length; p++) {
        if (p === shoot) { continue; }
        let h = 0;
        const piece = { ...pieces[p] };
        for (let i = piece.c1.x; i <= piece.c2.x; i++) {
            for (let j = piece.c1.y; j <= piece.c2.y; j++) {
                if (ground[i][j] > h) {
                    h = ground[i][j];
                }
            }
        }

        for (let i = piece.c1.x; i <= piece.c2.x; i++) {
            for (let j = piece.c1.y; j <= piece.c2.y; j++) {
                ground[i][j] = h + piece.c2.z - piece.c1.z + 1;
            }
        }

        if (shoot > -1 && (piece.c1.z !== h + 1) ) {
            fallingPieces++;
        }

        const delta = piece.c2.z - piece.c1.z;
        piece.c1.z = h + 1;
        piece.c2.z = piece.c1.z + delta;

        pieces[p] = piece;
    }

    if (shoot > -1) {
        return fallingPieces;
    }

    return pieces;
};

const printBoard = (board) => {
    console.log('-----------');
    const toPrint = [];
    for (let i = 0; i < board.length; i++) {
        toPrint.push(board[i].join(''));
    }
    console.log(toPrint.join("\n"));
    console.log('-----------');
}

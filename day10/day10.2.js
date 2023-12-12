const fs = require('fs');
const path = require("path");

const EXIT_S = 'S';
const EXIT_E = 'E';
const EXIT_W = 'W';
const EXIT_N = 'N';

const allowedMoves = {
    N: { allowed: ['7', '|', 'F'], '7': EXIT_W, '|': EXIT_N, 'F': EXIT_E},
    W: { allowed: ['L', '-', 'F'], 'L': EXIT_N, 'F': EXIT_S, '-': EXIT_W},
    S: { allowed: ['J', '|', 'L'], '|': EXIT_S, 'L': EXIT_E, 'J': EXIT_W},
    E: { allowed: ['7', '-', 'J'], '-': EXIT_E, '7': EXIT_S, 'J': EXIT_N},
};

const exits = {
    [`${EXIT_W}`]: [ 0, -1],
    [`${EXIT_E}`]: [ 0,  1],
    [`${EXIT_N}`]: [-1,  0],
    [`${EXIT_S}`]: [ 1,  0],
};

const scaled = {
    '.': [ ['.', '.', '.'], ['.', '.', '.'], ['.', '.', '.'] ],
    'S': [ ['.', 'X', '.'], ['X', 'X', 'X'], ['.', 'X', '.'] ],
    '-': [ ['.', '.', '.'], ['X', 'X', 'X'], ['.', '.', '.'] ],
    '|': [ ['.', 'X', '.'], ['.', 'X', '.'], ['.', 'X', '.'] ],
    'F': [ ['.', '.', '.'], ['.', 'X', 'X'], ['.', 'X', '.'] ],
    'L': [ ['.', 'X', '.'], ['.', 'X', 'X'], ['.', '.', '.'] ],
    'J': [ ['.', 'X', '.'], ['X', 'X', '.'], ['.', '.', '.'] ],
    '7': [ ['.', '.', '.'], ['X', 'X', '.'], ['.', 'X', '.'] ],
};

fs.readFile(path.join(__dirname, 'day10.input'), 'utf8', (err, data) => {
    const world = [];
    let queue = [];
    const sizes = [];
    const paths = [];

    data.split("\n").forEach((line) => {
        world.push(line.split(''));
    });

    const lines = world.length;
    const cols = world[0].length;

    for(let i = 0; i < lines; i++) {
        for(let j = 0; j < cols; j++) {
            if (world[i][j] === 'S') {
                queue.push({exit: EXIT_N, pos: [ i + exits[EXIT_N][0], j + exits[EXIT_N][1] ], count: 1, path: 1});
                paths[1] = [[i, j]];

                queue.push({exit: EXIT_W, pos: [ i + exits[EXIT_W][0], j + exits[EXIT_W][1] ], count: 1, path: 2});
                paths[2] = [[i, j]];

                queue.push({exit: EXIT_E, pos: [ i + exits[EXIT_E][0], j + exits[EXIT_E][1] ], count: 1, path: 3});
                paths[3] = [[i, j]];

                queue.push({exit: EXIT_S, pos: [ i + exits[EXIT_S][0], j + exits[EXIT_S][1] ], count: 1, path: 4});
                paths[4] = [[i, j]];

                i = lines;
                j = cols;
            }
        }
    }

    while (queue.length > 0) {
        const step = queue.shift();
        const newI = step.pos[0];
        const newJ = step.pos[1];

        // still on the board
        if (newI > -1 && newI < lines && newJ > -1 && newJ < cols) {
            // add to queue if correct move
            if (allowedMoves[step.exit].allowed.includes(world[newI][newJ])) {
                paths[step.path].push([newI, newJ]);

                queue.push({
                    exit: allowedMoves[step.exit][world[newI][newJ]],
                    pos: [newI + exits[allowedMoves[step.exit][world[newI][newJ]]][0], newJ + exits[allowedMoves[step.exit][world[newI][newJ]]][1] ],
                    count: step.count + 1,
                    path: step.path,
                });
            }
            // closing the path
            else if (world[newI][newJ] === 'S') {
                sizes[step.path] = step.count;
            }
        }
    }

    const maxLen = sizes.filter(size => size !== null).sort().pop();

    let path;
    for (let i = 0; i < paths.length; i++) {
        if (paths[i] !== undefined && paths[i].length === maxLen) {
            path = paths[i];

            break;
        }
    }

    const board = [];
    for (let i = 0; i < lines; i++) {
        board.push([]);
        for (let j = 0; j < cols; j++) {
            board[i].push('.');
        }
    }
    for (const point of path) {
        board[point[0]][point[1]] = world[point[0]][point[1]];
    }

    const upscaled = [];
    for (let i = 0; i < lines; i++) {
        for (let j = 0; j < cols; j++) {
            const x1 = i * 3;
            const y1 = j * 3;
            const x2 = x1 + 2;
            const y2 = y1 + 2;

            for (let x = x1; x <= x2; x++) {
                for (let y = y1; y <= y2; y++) {
                    if (upscaled[x] === undefined) {
                        upscaled[x] = [];
                    }

                    upscaled[x][y] = scaled[board[i][j]][2 - (x2 - x)][2 - (y2 - y)];
                }
            }
        }
    }

    queue = [{pos: [0, 0], color: 'O'}];
    while (queue.length > 0) {
        const tile = queue.shift();

        if(upscaled[tile.pos[0]][tile.pos[1]] !== tile.color) {
            upscaled[tile.pos[0]][tile.pos[1]] = tile.color;

            for (let i = -1; i < 2; i++) {
                for (let j = -1; j < 2; j++) {
                    if (
                        tile.pos[0] + i > -1 && tile.pos[1] + j > -1
                        && tile.pos[0] + i < upscaled.length && tile.pos[1] + j < upscaled[0].length
                        && upscaled[tile.pos[0] + i][tile.pos[1] + j] === '.'
                    ) {
                        queue.push({
                            pos: [tile.pos[0] + i, tile.pos[1] + j],
                            color: tile.color,
                        });
                    }
                }
            }
        }
    }

    const downscaled = [];
    for (let i = 0; i < board.length; i++) {
        downscaled.push([]);
        for (let j = 0; j < board[0].length; j++) {
            downscaled[i][j] = upscaled[i * 3 + 1][j * 3 + 1];
        }
    }

    // printBoard(downscaled);

    let inside = 0;
    for (let i = 0; i < downscaled.length; i++) {
        for (let j = 0; j < downscaled[0].length; j++) {
            if (downscaled[i][j] === '.') {
                inside++;
            }
        }
    }

    console.log(inside);
});

const printBoard = (board) => {
    console.log('---------------');
    const toPrint = [];
    for (let i = 0; i < board.length; i++) {
        toPrint.push(board[i].join(''));
    }
    console.log(toPrint.join("\n"));
    console.log('---------------');
};
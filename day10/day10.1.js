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

const links = ['-', '|', '7', ];

fs.readFile(path.join(__dirname, 'day10.input'), 'utf8', (err, data) => {
    const world = [];
    const queue = [];
    const sizes = [];

    data.split("\n").forEach((line) => {
        world.push(line.split(''));
    });

    const lines = world.length;
    const cols = world[0].length;

    for(let i = 0; i < lines; i++) {
        for(let j = 0; j < cols; j++) {
            if (world[i][j] === 'S') {
                queue.push({exit: EXIT_N, pos: [ i + exits[EXIT_N][0], j + exits[EXIT_N][1] ], count: 1, loop: 1});
                queue.push({exit: EXIT_W, pos: [ i + exits[EXIT_W][0], j + exits[EXIT_W][1] ], count: 1, loop: 2});
                queue.push({exit: EXIT_E, pos: [ i + exits[EXIT_E][0], j + exits[EXIT_E][1] ], count: 1, loop: 3});
                queue.push({exit: EXIT_S, pos: [ i + exits[EXIT_S][0], j + exits[EXIT_S][1] ], count: 1, loop: 4});

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
                queue.push({
                    exit: allowedMoves[step.exit][world[newI][newJ]],
                    pos: [newI + exits[allowedMoves[step.exit][world[newI][newJ]]][0], newJ + exits[allowedMoves[step.exit][world[newI][newJ]]][1] ],
                    count: step.count + 1,
                    loop: step.loop,
                });
            }
            // closing the loop
            else if (world[newI][newJ] === 'S') {
                sizes[step.loop] = step.count;
            }
        }
    }

    const maxLen = sizes.filter(size => size !== null).sort().pop();

    console.log(maxLen / 2);
});

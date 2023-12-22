const fs = require('fs');
const path = require('path');

const board = [];
let r, c;
const queue = [];
const DIR = [
    [0, 1],
    [1, 0],
    [-1, 0],
    [0, -1],
];

const positions = {};
const visited = {};
const targetSteps = 65;

fs.readFile(path.join(__dirname, 'day21.input'), 'utf8', (err, data) => {
    data.split("\n").forEach((line) => {
        board.push(line.split(''));
    });

    r = board.length;
    c = board[0].length;
    let start;

    for (let i = 0; i < r; i++) {
        for (let j = 0; j < c; j++) {
            if (board[i][j] === 'S') {
                start = [i, j];
            }
        }
    }
    board[start[0]][start[1]] = '.';

    queue.push({ pos: start, steps: 0 });


    computeSteps();
    // console.log(positions);
    snapshot();

    console.log(Object.keys(positions).length);
});

const computeSteps = () => {
    let printCounter = 0;

    while (queue.length > 0) {
        const tile = queue.shift();

        if (visited[`${tile.pos[0]}:${tile.pos[1]}:${tile.steps}`]) { continue; }
        visited[`${tile.pos[0]}:${tile.pos[1]}:${tile.steps}`] = 1;

        if (tile.steps === targetSteps) {
            positions[`${tile.pos[0]}:${tile.pos[1]}`] = 1;

            continue;
        }

        for (let mask of DIR) {
            const newPos = {
                x: tile.pos[0] + mask[0],
                y: tile.pos[1] + mask[1],
            };

            if (newPos.x < 0 || newPos.y < 0 || newPos.x >= r || newPos.y >= c
                || board[newPos.x][newPos.y] === '#' || positions[`${newPos.x}:${newPos.y}`] !== undefined
            ) {
                continue;
            }

            queue.push({
                pos: [newPos.x, newPos.y],
                steps: tile.steps + 1,
            });
        }
    }
};

const snapshot = () => {
    let snap = [];
    for (let i = 0; i < r; i++) {
        snap[i] = [];
        for (let j = 0; j < c; j++) {
            snap[i][j] = board[i][j];
        }
    }

    Object.keys(positions).forEach((serialized) => {
        let [x, y] = serialized.split(':');
        x = parseInt(x);
        y = parseInt(y);

        snap[x][y] = 'O';
    });

    printBoard(snap);
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
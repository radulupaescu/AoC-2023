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

let positions = {};
let visited = {};
let minVisited = {};
let targetSteps;

fs.readFile(path.join(__dirname, 'day21.input'), 'utf8', (err, data) => {
    data.split("\n").forEach((line) => {
        board.push(line.split(''));
    });

    r = board.length;
    c = board[0].length;
    let start;

    let pound = 0;
    let blocked = 0;
    for (let i = 0; i < r; i++) {
        for (let j = 0; j < c; j++) {
            if (board[i][j] === 'S') {
                start = [i, j];
            }

            if (board[i][j] === '#') {
                pound++;
            }

            if (board[i][j] === '.'
                && i - 1 > -1 && board[i - 1][j] === '#'
                && j - 1 > -1 && board[i][j - 1] === '#'
                && j + 1 < c && board[i][j + 1] === '#'
                && i + 1 < r && board[i + 1][j] === '#'
            ) {
                blocked++;
            }
        }
    }
    board[start[0]][start[1]] = '.';

    targetSteps = 65;
    positions = {};
    visited = {};
    minVisited = {};
    queue.push({ pos: start, steps: 0 });
    computeSteps();

    console.log('63:', Object.keys(positions).length);

    targetSteps = 64;
    positions = {};
    visited = {};
    minVisited = {};
    queue.push({ pos: start, steps: 0 });
    computeSteps();

    console.log('64:', Object.keys(positions).length);

    targetSteps = 132;
    positions = {};
    visited = {};
    minVisited = {};
    queue.push({ pos: start, steps: 0 });
    computeSteps();

    const evenCorners = Object.keys(minVisited).reduce((count, key) => {
        if (minVisited[key] % 2 === 0 && minVisited[key] > 65) {
            count++;
        }

        return count;
    }, 0);

    const oddCorners = Object.keys(minVisited).reduce((count, key) => {
        if (minVisited[key] % 2 === 1 && minVisited[key] > 65) {
            count++;
        }

        return count;
    }, 0);

    const evenFull = Object.keys(minVisited).reduce((count, key) => {
        if (minVisited[key] % 2 === 0) {
            count++;
        }

        return count;
    }, 0);

    const oddFull = Object.keys(minVisited).reduce((count, key) => {
        if (minVisited[key] % 2 === 1) {
            count++;
        }

        return count;
    }, 0);

    console.log('odd full/corners', oddFull, oddCorners);
    console.log('even full/corners', evenFull, evenCorners);

    console.log(Object.keys(minVisited).length, pound, blocked, 131 * 131, (Object.keys(minVisited).length + pound + blocked));

    const n = 202300;

    const p2 = (n + 1) * (n + 1) * oddFull + (n * n) * evenFull - (n + 1) * oddCorners + n * (evenCorners - 1);

    console.log(p2);
});

const computeSteps = () => {
    while (queue.length > 0) {
        const tile = queue.shift();

        if (visited[`${tile.pos[0]}:${tile.pos[1]}:${tile.steps}`]) { continue; }
        visited[`${tile.pos[0]}:${tile.pos[1]}:${tile.steps}`] = 1;

        if (!minVisited[`${tile.pos[0]}:${tile.pos[1]}`] || minVisited[`${tile.pos[0]}:${tile.pos[1]}`] > tile.steps) {
            minVisited[`${tile.pos[0]}:${tile.pos[1]}`] = tile.steps;
        }

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

    Object.keys(minVisited).forEach((serialized) => {
        let [x, y] = serialized.split(':');
        x = parseInt(x);
        y = parseInt(y);

        snap[x][y] = minVisited[`${x}:${y}`];
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
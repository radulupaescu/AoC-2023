const fs = require('fs');
const path = require('path');

const contraption = [];
let r, c;

fs.readFile(path.join(__dirname, 'day16.input'), 'utf8', (err, data) => {
    data.split("\n").forEach((line, index) => {
        contraption[index] = line.split('');
    });
    r = contraption.length;
    c = contraption[0].length;

    let max = 0;
    let count;
    for (let i = 0; i < r; i++) {
        count = simulation(contraption, { dir: [0, 1], coord: [i, 0] });
        if (count > max) { max = count; }

        count = simulation(contraption, { dir: [0, -1], coord: [i, c - 1] });
        if (count > max) { max = count; }
    }

    for (let j = 0; j < c; j++) {
        count = simulation(contraption, { dir: [1, 0], coord: [0, j] });
        if (count > max) { max = count; }

        count = simulation(contraption, { dir: [-1, 0], coord: [r - 1, j] });
        if (count > max) { max = count; }
    }

    console.log(max);
});

const simulation = (contraption, first) => {
    let beamPath = [];
    let visited = {};
    let seen = {};

    beamPath.push(first);

    while (beamPath.length > 0) {
        const current = beamPath.shift();
        const key = `${current.coord[0]}:${current.coord[1]}|${current.dir[0]}:${current.dir[1]}`;
        if (!(current.coord[0] > -1 &&  current.coord[0] < r && current.coord[1] > -1 &&  current.coord[1] < c) || seen[key]) {
            continue;
        }
        seen[key] = true;

        visited[`${current.coord[0]}:${current.coord[1]}`] =
            visited[`${current.coord[0]}:${current.coord[1]}`] ? visited[`${current.coord[0]}:${current.coord[1]}`]++ : 1;

        const tile = contraption[current.coord[0]][current.coord[1]];

        switch (tile) {
            case '.':
                beamPath.push({
                    dir: current.dir,
                    coord: [current.coord[0] + current.dir[0], current.coord[1] + current.dir[1]],
                });
                break;
            case '|':
                if (current.dir[1] === 0) {
                    beamPath.push({
                        dir: current.dir,
                        coord: [current.coord[0] + current.dir[0], current.coord[1] + current.dir[1]],
                    });
                } else {
                    beamPath.push({
                        dir: [-1, 0],
                        coord: [current.coord[0] - 1, current.coord[1]],
                    });
                    beamPath.push({
                        dir: [1, 0],
                        coord: [current.coord[0] + 1, current.coord[1]],
                    });
                }
                break;
            case '-':
                if (current.dir[0] === 0) {
                    beamPath.push({
                        dir: current.dir,
                        coord: [current.coord[0] + current.dir[0], current.coord[1] + current.dir[1]],
                    });
                } else {
                    beamPath.push({
                        dir: [0, 1],
                        coord: [current.coord[0], current.coord[1] + 1],
                    });
                    beamPath.push({
                        dir: [0, -1],
                        coord: [current.coord[0], current.coord[1] - 1],
                    });
                }
                break;
            case '\\':
                beamPath.push({
                    dir: [current.dir[1], current.dir[0]],
                    coord: [current.coord[0] + current.dir[1], current.coord[1] + current.dir[0]],
                });
                break;
            case '/':
                beamPath.push({
                    dir: [Math.round(-1 * current.dir[1]), Math.round(-1 * current.dir[0])],
                    coord: [current.coord[0] + Math.round(-1 * current.dir[1]), current.coord[1] + Math.round(-1 * current.dir[0])],
                });
                break;
        }
    }

    return Object.keys(visited).length;
}

const snapshot = () => {
    let con2 = [];
    for (let i = 0; i < r; i++) {
        con2[i] = [];
        for (let j = 0; j < c; j++) {
            con2[i][j] = '.';
        }
    }

    Object.keys(visited).forEach((serialized) => {
        let [x, y] = serialized.split(':');
        con2[x][y] = '#';
    });

    printBoard(con2);
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

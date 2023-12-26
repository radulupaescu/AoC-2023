const fs = require('fs');
const path = require('path');

fs.readFile(path.join(__dirname, 'day23.input'), 'utf8', (err, data) => {
    const board = [];
    const start = { r: 0, c: -1 };
    const end = { r: 0, c: -1 };

    data.split("\n").forEach((line, index) => {
        board.push(line.split(''));
    });

    for (let i = 0; i < board[0].length; i++) {
        if (board[0][i] === '.') {
            start.r = 0;
            start.c = i;
        }

        if (board[board.length - 1][i] === '.') {
            end.r = board.length - 1;
            end.c = i;
        }
    }

    const len = findScenicRoute(board, start, end);

    console.log(len);
});

const step = (board, row, col, dr, dc) => {
    const slipDelta = {
        '^': { dr: -1, dc: 0, },
        'v': { dr: 1, dc: 0, },
        '<': { dr: 0, dc: -1, },
        '>': { dr: 0, dc: 1, },
    };
    let newRow = row + dr;
    let newCol = col + dc;
    let steps = 1;

    if (!onBoard(newRow, newCol, board)) { return [-2, -2]; }

    if (['^', 'v', '>', '<'].includes(board[newRow][newCol])) {
        const slip = { ...slipDelta[board[newRow][newCol]], };

        newRow = newRow + slip.dr;
        newCol = newCol + slip.dc;
        steps = 2;

        if (!onBoard(newRow, newCol, board)) { return [-2, -2]; }
    }

    return [newRow, newCol, steps];
};

const onBoard = (row, col, board) => {
    const rows = board.length;
    const cols = board[0].length;

    return row > -1 && row < rows && col >= 0 && col < cols;
};

const isValidMove = (board, visited, row, col) => {
    return board[row][col] === '.' && !visited[row][col];
}

const dfs = (board, visited, row, col, length, endRow, endCol) => {
    const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];

    if (row === endRow && col === endCol) {
        return length;
    }

    let maxLength = length;

    for (const [dr, dc] of directions) {
        const [newRow, newCol, steps] = step(board, row, col, dr, dc);
        if (newRow === -2 && newCol === -2) { continue; }

        if (isValidMove(board, visited, newRow, newCol)) {
            visited[newRow][newCol] = true;

            const result = dfs(board, visited, newRow, newCol, length + steps, endRow, endCol);

            if (result > maxLength) {
                maxLength = result;
            }

            visited[newRow][newCol] = false;
        }
    }

    return maxLength;
}

const findScenicRoute = (board, start, end) => {
    const rows = board.length;
    const cols = board[0].length;
    const visited = new Array(rows).fill(null).map(() =>
        new Array(cols).fill(null),
    );

    return dfs(board, visited, start.r, start.c, 0, end.r, end.c);
}

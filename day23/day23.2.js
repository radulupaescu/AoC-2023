const fs = require('fs');
const path = require('path');

const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];
const start = { r: 0, c: -1 };
const end = { r: 0, c: -1 };

fs.readFile(path.join(__dirname, 'day23.input'), 'utf8', (err, data) => {
    const board = [];

    data.split("\n").forEach((line, index) => {
        board.push(line
            .replaceAll('v', '.')
            .replaceAll('^', '.')
            .replaceAll('<', '.')
            .replaceAll('>', '.')
            // .replaceAll('.', ' ')
            .split('')
        );
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

    const graph = makeGraph(board, start);

    console.log(dfs(graph, {},`${start.r}:${start.c}`, 0, `${end.r}:${end.c}`));
});

const countNeighbors = (board, r, c) => {
    let neighbors = 0;
    for (const [dr, dc] of directions) {
        if (onBoard(board, r + dr, c + dc) && board[r + dr][c + dc] === '.') {
            neighbors++;
        }
    }

    return neighbors;
};

const isJunction = (board, r, c) => {
    return (r === start.r && c === start.c)
        || (r === end.r && c === end.c)
        || countNeighbors(board, r, c) > 2;
};

const onBoard = (board, r, c) => {
    const rows = board.length;
    const cols = board[0].length;

    return r >= 0 && r < rows && c >= 0 && c < cols;
}

const makeGraph = (board, start) => {
    const graph = {};
    const queue = [];
    const visited = {};

    queue.push([ start.r, start.c ]);
    while (queue.length) {
        const [r, c] = queue.pop();
        visited[`${r}:${c}`] = 1;
        graph[`${r}:${c}`] = {};

        searchNearbyJunctions(board, r, c).forEach((junction) => {
            const [jr, jc, steps] = junction;
            if (!visited[`${jr}:${jc}`]) {
                queue.push([jr, jc]);
            }
            graph[`${r}:${c}`][`${jr}:${jc}`] = steps;
        });
    }

    return graph;
};

const searchNearbyJunctions = (board, sr, sc) => {
    const rows = board.length;
    const cols = board[0].length;
    const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
    const queue = [];
    const junctions = [];

    queue.push([sr, sc, 0]);
    visited[sr][sc] = true;

    while (queue.length > 0) {
        const [r, c, steps] = queue.shift();

        if ((r !== sr || c !== sc) && isJunction(board, r, c)) {
            junctions.push([r, c, steps]);

            continue;
        }

        const moves = directions.map(delta => [r + delta[0], c + delta[1]]);
        for (const move of moves) {
            const [ nr, nc ] = move;

            if (onBoard(board, nr, nc) && board[nr][nc] === '.' && !visited[nr][nc]) {
                queue.push([...move, steps + 1]);
                visited[nr][nc] = true;
            }
        }
    }

    return junctions;
}

const dfs = (graph, visited, node, length, stop) => {
    if (node === stop) {
        return length;
    }

    let maxLength = length;

    Object.keys(graph[node]).forEach((neighbor) => {
        if (!visited[neighbor]) {
            visited[neighbor] = true;

            const len = dfs(graph, visited, neighbor, length + graph[node][neighbor], stop);

            if (maxLength < len) {
                maxLength = len;
            }

            visited[neighbor] = false;
        }
    });

    return maxLength;
}

const snapshot = (board, visited) => {
    const printable = [];
    for (let i = 0; i < board.length; i++) {
        printable[i] = [];
        for (let j = 0; j < board[0].length; j++) {
            printable[i][j] = board[i][j];

            if (visited[i][j]) {
                printable[i][j] = '0';
            }
        }
    }

    printBoard(printable);
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

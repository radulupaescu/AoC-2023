const fs = require('fs');
const path = require('path');

fs.readFile(path.join(__dirname, 'day25.input'), 'utf8', (err, data) => {
    const graph = {};
    data.split("\n").forEach((line) => {
        let [main, links] = line.replaceAll(': ', ':').split(':');
        links = links.split(' ');

        if (!graph[main]) {
            graph[main] = {};
        }

        links.forEach(link => {
            if (!graph[link]) {
                graph[link] = {};
            }

            graph[link][main] = 1;
            graph[main][link] = 1;
        });
    });

    const nodes = Object.keys(graph);
    let traffic = {};
    let passes = 0.5 * (nodes.length - 1) * nodes.length;
    let current = 1;

    let startTime = new Date().getTime();

    for (let i = 0; i < nodes.length - 1; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            console.log(`processing (${current} / ${passes})`);
            current++;
            let path = bfs(graph, nodes[i], nodes[j]);

            for (let k = 0; k < path.length - 1; k++) {
                const key = `${path[k]}:${path[k + 1]}`;
                const yek = `${path[k+1]}:${path[k]}`;

                if (!traffic[key] && !traffic[yek]) {
                    traffic[key] = 1;
                } else if (!traffic[key] && !!traffic[yek]) {
                    traffic[yek] += 1;
                } else if (!traffic[yek] && !!traffic[key]) {
                    traffic[key] += 1;
                }
            }
        }
    }

    const top3 = Object.keys(traffic)
        .sort((a, b) => traffic[b] - traffic[a])
        .splice(0, 3);

    top3.forEach((link) => {
        const [a, b] = link.split(':');
        delete graph[a][b];
        delete graph[b][a];
    });

    let unreachable = 0;
    const start = nodes[0];
    for (let i = 1; i < nodes.length; i++) {
        const path = bfs(graph, start, nodes[i]);

        if (!path) {
            unreachable++;
        }
    }

    console.log(unreachable * (nodes.length - unreachable));

    let endTime = new Date().getTime();

    console.log('done in: ', (endTime - startTime) / 1000, 'seconds');
});

const bfs = (graph, startNode, endNode) => {
    const queue = [startNode];
    const visited = { [startNode]: true };
    const parents = { [startNode]: null };

    while (queue.length > 0) {
        const currentNode = queue.shift();
        if (currentNode === endNode) {
            return reconstructPath(parents, startNode, endNode);
        }

        const neighbors = Object.keys(graph[currentNode]);
        for (const neighbor of neighbors) {
            if (!visited[neighbor]) {
                visited[neighbor] = true;
                parents[neighbor] = currentNode;
                queue.push(neighbor);
            }
        }
    }

    return null;
}

const reconstructPath = (parents, startNode, endNode) => {
    const path = [endNode];
    let current = endNode;

    while (current !== startNode) {
        current = parents[current];
        path.unshift(current);
    }

    return path;
}

const fs = require('fs');
const path = require('path');

const min = 200000000000000;
const max = 400000000000000;

fs.readFile(path.join(__dirname, 'day24.input'), 'utf8', (err, data) => {
    const stones = [];
    data.split("\n").forEach((line) => {
        const [coord, speed] = line.replaceAll(' ', '').split('@').map((s) => s.split(',').map(v => parseInt(v)));
        stones.push({
            p: { x: coord[0], y: coord[1], },
            s: { x: speed[0], y: speed[1], },
            m: speed[1] / speed[0],
            b: -1 * (speed[1] / speed[0]) * coord[0] + coord[1],
        });
    });

    let counter = 0;
    for (let i = 0; i < stones.length - 1; i++) {
        for (let j = i + 1; j < stones.length; j++) {
            const intersection = intersect(stones[i], stones[j]);

            if (intersection
                && intersectionInTestArea(intersection, min, max)
                && intersectionInTheFuture(intersection, stones[i].p, stones[i].s)
                && intersectionInTheFuture(intersection, stones[j].p, stones[j].s)
            ) {
                counter++;
            }
        }
    }

    console.log(counter);
});

const intersectionInTheFuture = (intersection, point, speed) => {
    return Math.sign(intersection.x - point.x) === Math.sign(speed.x)
        && Math.sign(intersection.y - point.y) === Math.sign(speed.y);
}

const intersectionInTestArea = (intersection, min, max) => {
    return intersection.x >= min && intersection.x <= max && intersection.y >= min && intersection.y <= max;
}

const intersect = (l1, l2) => {
    if (l1.m === l2.m) { return null; }

    const x = (l2.b - l1.b) / (l1.m - l2.m);

    return {
        x,
        y: l1.m * x + l1.b,
    }
};
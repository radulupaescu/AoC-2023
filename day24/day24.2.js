const fs = require('fs');
const path = require('path');

fs.readFile(path.join(__dirname, 'day24.input'), 'utf8', (err, data) => {
    const stones = [];
    data.split("\n").forEach((line) => {
        const [coord, speed] = line.replaceAll(' ', '').split('@').map((s) => s.split(',').map(v => parseInt(v)));
        stones.push({
            pos: { x: BigInt(coord[0]), y: BigInt(coord[1]), z: BigInt(coord[2]), },
            spd: { x: BigInt(speed[0]), y: BigInt(speed[1]), z: BigInt(speed[2]), }
        });
    });

    const deltaTranslateCoords = stones[0].pos;
    const deltaTranslateSpeed = stones[0].spd;
    const origin = {x: 0n, y: 0n, z: 0n};
    const translated = [];

    stones.forEach(stone => {
        translated.push({
            pos: minus(stone.pos, deltaTranslateCoords),
            spd: minus(stone.spd, deltaTranslateSpeed)
        });
    });

    const stone1 = translated[1];
    const p11 = stone1.pos;
    const p12 = plus(stone1.pos, stone1.spd);
    const planeNormal = crossProduct(p11, p12);
    const stone2 = translated[2];
    const stone3 = translated[3];

    const [p2, t2] = stoneAndPlaneIntersection(origin, planeNormal, stone2);
    const [p3, t3] = stoneAndPlaneIntersection(origin, planeNormal, stone3);

    const timeDiff = t2 - t3;
    const spd = scalarDiv(minus(p2, p3), timeDiff);
    const pos = minus(p2, scale(spd, t2));

    const magicStone = {
        pos: plus(pos, deltaTranslateCoords),
        spd: plus(spd, deltaTranslateSpeed),
    };

    console.log(magicStone);

    console.log(magicStone.pos.x + magicStone.pos.y + magicStone.pos.z)
});

const stoneAndPlaneIntersection = (origin, normal, stone) => {
    const a = dotProduct(minus(origin, stone.pos), normal);
    const b = dotProduct(stone.spd, normal);
    const time = a / b;
    const point = plus(stone.pos, scale(stone.spd, time));

    return [point, time];
};

const crossProduct = (a, b) => {
    return {
        x: a.y * b.z - a.z * b.y,
        y: a.z * b.x - a.x * b.z,
        z: a.x * b.y - a.y * b.x,
    };
}

const dotProduct = (a, b) => {
    return a.x * b.x + a.y * b.y + a.z * b.z;
}

const minus = (p, delta) => {
    return {
        x: p.x - delta.x,
        y: p.y - delta.y,
        z: p.z - delta.z,
    };
};

const plus = (p, delta) => {
    return {
        x: p.x + delta.x,
        y: p.y + delta.y,
        z: p.z + delta.z,
    }
};

const scalarDiv = (p, scalar) => {
    return {
        x: p.x / scalar,
        y: p.y / scalar,
        z: p.z / scalar,
    };
};

const scale = (p, scalar) => {
    return {
        x: p.x * scalar,
        y: p.y * scalar,
        z: p.z * scalar,
    };
};

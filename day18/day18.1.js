const fs = require('fs');
const path = require('path');

fs.readFile(path.join(__dirname, 'day18.input'), 'utf8', (err, data) => {
    let coordinates = [];
    let point = [0, 0];
    coordinates.push(point);

    data.split("\n").forEach((line, index) => {
        let instruction = line.split('(')[0].split(' ').filter((value) => value !== '');
        instruction = [instruction[0], parseInt(instruction[1])];

        switch (instruction[0]) {
            case 'R':
                point = [point[0], point[1] + instruction[1]];
                break;
            case 'U':
                point = [point[0] - instruction[1], point[1]];
                break;
            case 'L':
                point = [point[0], point[1] - instruction[1]];
                break;
            case 'D':
                point = [point[0] + instruction[1], point[1]];
                break;
        }

        coordinates.push(point);
    });

    let sum = 2;
    for (let i = 0; i < coordinates.length - 1; i++) {
        const [x1, y1] = coordinates[i];
        const [x2, y2] = coordinates[i + 1];

        sum += Math.abs(x1 - x2) + Math.abs(y1 - y2) + (x1 + x2) * (y1 - y2);
    }

    console.log(sum / 2);
});


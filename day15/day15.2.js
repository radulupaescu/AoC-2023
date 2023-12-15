const fs = require('fs');
const path = require('path');

const boxes = [];

fs.readFile(path.join(__dirname, 'day15.input'), 'utf8', (err, data) => {
    let sum = 0;
    data.split(',').forEach((step) => {
        let label;
        let op;
        let focal;

        if (step.split('=').length === 1) {
            op = '-';
            [label, focal] = step.split('-');
            if (isNaN(parseInt(focal))) {
                focal = null;
            } else {
                focal = parseInt(focal);
            }
        } else {
            op = '=';
            [label, focal] = step.split('=');
            focal = parseInt(focal);
        }

        const box = computeHash(label);
        if (!boxes[box]) {
            boxes[box] = [];
        }

        process(box, op, label, focal);
    });

    let totalFocalPower = 0;

    boxes.forEach((box, index) => {
        if (!box || box.length === 0) { return; }

        let focalPower = 0;
        const boxId = index + 1;
        box.forEach((lens, slot) => {
            focalPower += boxId * (slot + 1) * lens.focal;
        });

        totalFocalPower += focalPower;
    });

    console.log(totalFocalPower);
});

const process = (boxId, op, label, focal) => {
    let box = boxes[boxId];

    if (op === '=') {
        let found = -1;
        box.forEach((lens, index) => {
            if (lens.label === label) {
                found = index;
            }
        });

        if (found > -1) {
            box[found].focal = focal;
        } else {
            box.push({
                label: label,
                focal: focal,
            });
        }
    } else {
        let found = -1;
        box.forEach((lens, index) => {
            if (lens.label === label) {
                found = index;
            }
        });

        if (found > -1) {
            box.splice(found, 1);
        }
    }
};

const computeHash = (string) => {
    let currVal = 0;
    for (let i = 0; i < string.length; i++) {
        // Increase the current value by the ASCII code you just determined.
        // Set the current value to itself multiplied by 17.
        // Set the current value to the remainder of dividing itself by 256.
        currVal += string.charCodeAt(i);
        currVal *= 17;
        currVal = currVal % 256;
    }

    return currVal;
};

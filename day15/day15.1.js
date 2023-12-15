const fs = require('fs');
const path = require('path');

fs.readFile(path.join(__dirname, 'day15.input'), 'utf8', (err, data) => {
    let sum = 0;
    data.split(',').forEach((step) => {
        sum += computeHash(step);
    });

    console.log(sum);
});

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

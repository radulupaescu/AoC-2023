const fs = require('fs');
const path = require("path");

fs.readFile(path.join(__dirname, 'day1.input'), 'utf8', (err, data) => {
    let sum = 0;
    data.split("\n").forEach((line) => {
        let first = null;
        let last = null;
        line.split('').forEach((char) => {
            if (!!parseInt(char) && !first) {
                first = char;
            }

            if (!!parseInt(char)) {
                last = char;
            }
        });

        sum += parseInt(`${first}${last}`);
    });

    console.log(sum);
});


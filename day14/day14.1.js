const fs = require('fs');
const path = require("path");

fs.readFile(path.join(__dirname, 'day14.input'), 'utf8', (err, data) => {
    const platform = [];
    data.split("\n").forEach((line) => {
        platform.push(line.split(''));
    });

    let load = 0;
    for (let j = 0; j < platform[0].length; j++) {
        let rocks = 0;
        for (let i = 0; i < platform.length; i++) {
            if (platform[i][j] === 'O') {
                load += platform.length - rocks;
                rocks++;
            }

            if (platform[i][j] === '#') {
                rocks = i + 1;
            }
        }
    }

    console.log(load);
});
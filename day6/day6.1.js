const fs = require('fs');
const path = require('path');

fs.readFile(path.join(__dirname, 'day6.input'), 'utf8', (err, data) => {
    const times = data.split("\n")[0].split(':')[1].split(' ').filter(val => val !== '').map((val) => parseInt(val));
    const distances = data.split("\n")[1].split(':')[1].split(' ').filter(val => val !== '').map((val) => parseInt(val));

    let avMargins = 1;

    for (let race = 0; race < times.length; race++) {
        const s1 = (-1 * times[race] + Math.sqrt(times[race] * times[race] - 4 * distances[race])) / -2;
        const s2 = (-1 * times[race] - Math.sqrt(times[race] * times[race] - 4 * distances[race])) / -2;

        let r = 0;
        const d1 = Math.ceil(s1);
        const d2 = Math.floor(s2);

        if (d1 - s1 === 0) {
            r++;
        }

        if (d2 - s2 === 0) {
            r++;
        }

        avMargins *= d2 - d1 + 1 - r;
    }

    console.log(avMargins);
});

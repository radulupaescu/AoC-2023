const fs = require('fs');
const path = require('path');

fs.readFile(path.join(__dirname, 'day6.input'), 'utf8', (err, data) => {
    const time = parseInt(data.split("\n")[0].split(':')[1].replaceAll(' ', ''));
    const distance = parseInt(data.split("\n")[1].split(':')[1].replaceAll(' ', ''));
    const s1 = (-1 * time + Math.sqrt(time * time - 4 * distance)) / -2;
    const s2 = (-1 * time - Math.sqrt(time * time - 4 * distance)) / -2;

    let r = 0;
    const d1 = Math.ceil(s1);
    const d2 = Math.floor(s2);

    if (d1 - s1 === 0) {
        r++;
    }

    if (d2 - s2 === 0) {
        r++;
    }

    console.log(d2 - d1 + 1 - r);
});

const fs = require('fs');
const path = require("path");

const testersEarliest = [
    {test: /0/, value: '0',},
    {test: /1/, value: '1',},
    {test: /2/, value: '2',},
    {test: /3/, value: '3',},
    {test: /4/, value: '4',},
    {test: /5/, value: '5',},
    {test: /6/, value: '6',},
    {test: /7/, value: '7',},
    {test: /8/, value: '8',},
    {test: /9/, value: '9',},
    {test: /one/, value: '1',},
    {test: /two/, value: '2',},
    {test: /three/, value: '3',},
    {test: /four/, value: '4',},
    {test: /five/, value: '5',},
    {test: /six/, value: '6',},
    {test: /seven/, value: '7',},
    {test: /eight/, value: '8',},
    {test: /nine/, value: '9',},
];

const testersLatest = [
    {test: /0/, value: '0',},
    {test: /1/, value: '1',},
    {test: /2/, value: '2',},
    {test: /3/, value: '3',},
    {test: /4/, value: '4',},
    {test: /5/, value: '5',},
    {test: /6/, value: '6',},
    {test: /7/, value: '7',},
    {test: /8/, value: '8',},
    {test: /9/, value: '9',},
    {test: /eno/, value: '1',},
    {test: /owt/, value: '2',},
    {test: /eerht/, value: '3',},
    {test: /ruof/, value: '4',},
    {test: /evif/, value: '5',},
    {test: /xis/, value: '6',},
    {test: /neves/, value: '7',},
    {test: /thgie/, value: '8',},
    {test: /enin/, value: '9',},
];

fs.readFile(path.join(__dirname, 'day1.input'), 'utf8', (err, data) => {
    let sum = 0;
    data.split("\n").forEach((line) => {
        let first = null;
        let last = null;

        let firstIndex = 999999999;
        testersEarliest.forEach((tester) => {
            const index = tester.test.exec(line)?.index;
            if (index !== undefined && index < firstIndex) {
                firstIndex = index;
                first = tester.value;
            }
        });

        const reversed = line.split('').reverse().join('');
        firstIndex = 999999999;
        testersLatest.forEach((tester) => {
            const index = tester.test.exec(reversed)?.index;
            if (index !== undefined && index < firstIndex) {

                firstIndex = index;
                last = tester.value;
            }
        });

        sum += parseInt(`${first}${last}`);
    });

    console.log(sum);
});


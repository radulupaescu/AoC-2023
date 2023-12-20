const fs = require('fs');
const path = require('path');

const flows = {};

fs.readFile(path.join(__dirname, 'day19.input'), 'utf8', (err, data) => {
    let readFlows = true;
    data.split("\n").forEach((line, index) => {
        if (line === '') {
            readFlows = false;

            return;
        }

        if (readFlows) {
            let [flowName, config] = line.split('{');
            config = config.substring(0, config.length - 1).split(',');
            flows[flowName] = config;
        }
    });

    let combinations = 0;

    const queue = [{ flow: 'in', intervals: { x: [1, 4000], m: [1, 4000], a: [1, 4000], s: [1, 4000] } }];
    while (queue.length > 0) {
        let partsIntervals = queue.shift();

        if (partsIntervals.flow === 'R') {
            continue;
        }

        if (partsIntervals.flow === 'A') {
            combinations += Object.keys(partsIntervals.intervals)
                .map((prop) => partsIntervals.intervals[prop][1] - partsIntervals.intervals[prop][0] + 1 )
                .reduce((prod, value) => { return prod * value; } , 1);

            continue;
        }


        for (let step of flows[partsIntervals.flow]) {
            if (step[1] === '>' || step[1] === '<') {
                let [test, flowName] = step.split(':');
                const split = splitForTest(test, partsIntervals.intervals);
                queue.push({
                    flow: flowName,
                    intervals: split[0],
                });

                partsIntervals = {
                    flow: partsIntervals.flow,
                    intervals: split[1],
                };
            } else {
                queue.push({
                    flow: step,
                    intervals: partsIntervals.intervals,
                });
            }
        }
    }

    console.log(combinations);
});

const splitForTest = (test, intervals) => {
    const condition = test[1];
    let [prop, value] = test.split(test[1]);
    value = parseInt(value);

    const propIntervals = condition === '>'
        ? [ [value + 1, intervals[prop][1]], [intervals[prop][0], value] ]
        : [ [intervals[prop][0], value - 1], [value, intervals[prop][1]] ];

    const partsIntervals = [
        {...intervals},
        {...intervals}
    ];

    partsIntervals[0][prop] = propIntervals[0];
    partsIntervals[1][prop] = propIntervals[1];

    return partsIntervals;
};

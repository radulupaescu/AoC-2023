const fs = require('fs');
const path = require('path');

const flows = {
    'A': (part) => {
        return part.x + part.m + part.a + part.s;
    },
    'R': () => {
        return 0;
    },
};
const parts = [];

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
        } else {
            parts.push(JSON.parse(
                line
                    .replaceAll('=', ':')
                    .replaceAll('{', '{"')
                    .replaceAll(':', '":')
                    .replaceAll(',', ',"')
            ));
        }
    });

    let sum = 0;
    parts.forEach(part => {
        sum += doFlow(part, flows['in']);
    });

    console.log(sum);
});

const doFlow = (part, flow) => {
    if (typeof flow === 'function') {
        return flow(part);
    }

    for (let step of flow) {
        if (step[1] === '>' || step[1] === '<') {
            let [test, flowName] = step.split(':');
            if (runTest(part, test)) {
                return doFlow(part, flows[flowName]);
            }
        } else {
            return doFlow(part, flows[step]);
        }
    }
};

const runTest = (part, test) => {
    const condition = test[1];
    let [prop, value] = test.split(test[1]);
    value = parseInt(value);

    return condition === '>' ? part[prop] > value : part[prop] < value;
};

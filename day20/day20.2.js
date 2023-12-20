const fs = require('fs');
const path = require('path');

const modules = {};
let handlerModule;
let cycleWitness = {};

fs.readFile(path.join(__dirname, 'day20.input'), 'utf8', (err, data) => {
    let inputs = {};
    data.split("\n").forEach((line, index) => {
        let [moduleDefinition, destinations] = line.replaceAll(' ', '').split('->');
        destinations = destinations.split(',');
        const module = {
            name: moduleDefinition,
            destinations,
            type: null,
            state: null,
        };

        if (moduleDefinition[0] === '%') {
            module.type = 'ff';
            module.name = moduleDefinition.substring(1, moduleDefinition.length);
            module.state = 0;
        } else if (moduleDefinition[0] === '&') {
            module.type = 'cj';
            module.name = moduleDefinition.substring(1, moduleDefinition.length);
        } else if (moduleDefinition === 'broadcaster') {
            module.type = 'bc';
        }

        destinations.forEach((destination) => {
            if (!inputs[destination]) { inputs[destination] = []; }
            inputs[destination].push(module.name);
        });

        modules[module.name] = module;
    });

    Object.keys(modules).forEach((moduleName) => {
        if (modules[moduleName].type === 'cj') {
            modules[moduleName].state = {};

            inputs[moduleName].forEach((input) => {
                modules[moduleName].state[input] = 0;
            });
        }
    });

    handlerModule = modules[inputs['rx']];
    inputs[handlerModule.name].forEach((activationModule) => {
        cycleWitness[activationModule] = [];
    });

    let pressed = 0;
    do {
        pressed++;
        processQueue([{ module: modules.broadcaster, input: 0 }], pressed);
    } while (!enoughDataCollected());

    const lenghts = Object.keys(cycleWitness).map(module => cycleWitness[module][1] - cycleWitness[module][0]);

    let multiple = lenghts[0];
    lenghts.forEach((n) => {
        multiple = lcm(multiple, n);
    });

    console.log(multiple);
});

const enoughDataCollected = () => {
    return Object.keys(cycleWitness).map((module) => cycleWitness[module].length).filter(val => val !== 2).length === 0;
};

const processQueue = (queue, cycle) => {
    const counter = {
        lo: 1, // first button press
        hi: 0,
    };

    while (queue.length > 0) {
        const action = queue.shift();
        let result, key;

        if (action.to === handlerModule.name && action.input === 1) {
            cycleWitness[action.from].push(cycle);
        }

        if (action.to === 'rx' && action.input === 0) {
            return true;
        }

        if (!action.module) {
            continue;
        }

        switch (action.module.type) {
            case 'bc':
                for (const destination of action.module.destinations) {
                    counter.lo += 1;
                    queue.push({ to: destination, module: modules[destination], input: action.input, from: action.module.name, });
                }
                break;
            case 'cj':
                result = conjunction({
                    state: action.module.state,
                    pos: action.from,
                    value: action.input,
                });

                modules[action.module.name].state = result.state;
                key = result.emit === 1 ? 'hi' : 'lo';

                for (const destination of action.module.destinations) {
                    counter[key] += 1;
                    queue.push({ to: destination, module: modules[destination], input: result.emit, from: action.module.name, });
                }
                break;
            case 'ff':
                result = flipflop({
                    state: action.module.state,
                    value: action.input,
                });

                if (!result) {
                    break;
                }

                modules[action.module.name].state = result.state;
                key = result.emit === 1 ? 'hi' : 'lo';

                for (const destination of action.module.destinations) {
                    counter[key] += 1;
                    queue.push({ to: destination, module: modules[destination], input: result.emit, from: action.module.name, });
                }
                break;
        }
    }

    return false;
}

const flipflop = (input) => {
    if (input.state === 0 && input.value === 0) {
        return {
            state: 1,
            emit: 1,
        };
    } else if (input.state === 1 && input.value === 0) {
        return {
            state: 0,
            emit: 0,
        }
    }

    return null;
};

const conjunction = (input) => {
    input.state[input.pos] = input.value;

    return {
        state: input.state,
        emit: Object.keys(input.state).reduce((acc, val) => acc && input.state[val], true) ? 0 : 1,
    };
};

const gcd = (a, b) => {
    return !b ? a : gcd(b, a % b);
};

const lcm = (a, b) => {
    return (a * b) / gcd(a, b);
};

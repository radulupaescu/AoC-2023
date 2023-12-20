const fs = require('fs');
const path = require('path');

const modules = {};

fs.readFile(path.join(__dirname, 'day20.input'), 'utf8', (err, data) => {
    let inputs = {};
    const counter = {
        lo: 0,
        hi: 0,
    };

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

    for (let i = 0; i < 1000; i++) {
        const stepCounter = processQueue([{ module: modules.broadcaster, input: 0 }]);

        counter.hi += stepCounter.hi;
        counter.lo += stepCounter.lo;
    }

    console.log(counter.hi * counter.lo);
});

const processQueue = (queue) => {
    const counter = {
        lo: 1, // first button press
        hi: 0,
    };

    while (queue.length > 0) {
        const action = queue.shift();
        let result, key;

        if (!action.module) {
            continue;
        }

        switch (action.module.type) {
            case 'bc':
                for (const destination of action.module.destinations) {
                    counter.lo += 1;
                    queue.push({ module: modules[destination], input: action.input, from: action.module.name, });
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
                    queue.push({ module: modules[destination], input: result.emit, from: action.module.name, });
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
                    queue.push({ module: modules[destination], input: result.emit, from: action.module.name, });
                }
                break;
        }
    }

    return counter;
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


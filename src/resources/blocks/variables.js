import javascriptGenerator from '../javascriptGenerator';
import registerBlock from '../register';

const categoryPrefix = 'variable_';
const categoryColor = '#FF8C1A';

function register() {

    // define variable
    registerBlock(`${categoryPrefix}declare_int`, {
        message0: 'define int %1',
        args0: [
            {
                "type": "field_input",
                "name": "NAME",
                "checks": "String"
            }
        ],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const NAME = block.getFieldValue('NAME');

        window.vars[NAME] = {
            pointer: window.memPointer,
            type: "int"
        }
        window.memPointer++;

        // define doesnt *actually* do anything, but it 'allocates' a space in memory
        return "";
    });

    registerBlock(`${categoryPrefix}declare_bool`, {
        message0: 'define bool %1',
        args0: [
            {
                "type": "field_input",
                "name": "NAME",
                "checks": "String"
            }
        ],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const NAME = block.getFieldValue('NAME');

        window.vars[NAME] = {
            pointer: window.memPointer,
            type: "bool"
        }
        window.memPointer++;

        // define doesnt *actually* do anything, but it 'allocates' a space in memory
        return "";
    });

    registerBlock(`${categoryPrefix}declare_string`, {
        message0: 'define string %1 with length %2',
        args0: [
            {
                "type": "field_input",
                "name": "NAME",
                "checks": "String"
            },

            {
                "type": "field_input",
                "name": "LENGTH",
                "checks": "Number"
            }
        ],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const NAME = block.getFieldValue('NAME');
        const LENGTH = block.getFieldValue('LENGTH');

        window.vars[NAME] = {
            pointer: window.memPointer,
            type: "string"
        }
        window.memPointer += LENGTH;

        // define doesnt *actually* do anything, but it 'allocates' a space in memory
        return "";
    });

    // set variable
    registerBlock(`${categoryPrefix}set`, {
        message0: 'set %1 to %2',
        args0: [
            {
                "type": "field_input",
                "name": "NAME",
                "checks": "String"
            },
            {
                "type": "input_value",
                "name": "VAR"
            }
        ],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const NAME = block.getFieldValue('NAME');
        const VAR = javascriptGenerator.valueToCode(block, 'VAR', javascriptGenerator.ORDER_ATOMIC);
        
        const code = [VAR];

        switch (window.vars[NAME].type) {
            case "int":
                code.push("pop r7");
                code.push(`saveRamReg r7 ${window.vars[NAME].pointer}`);
                break;
            case "bool":
                code.push("pop r7");
                code.push(`saveRamReg r7 ${window.vars[NAME].pointer}`);
                break;
            case "string":
                code.push([
                    `set ${window.vars[NAME].pointer} r5`, // counter
                    `label vars_set_string${window.labelCount}`,
                    "pop r7",
                    `saveRamRegs r7 r5`,
                    "addReg r5 1 r5",
                    `ifNEqReg r7 0 vars_set_string${window.labelCount}`,
                ].join("\n"));
                window.labelCount++;
                break;
        }

        return `${code.join("\n")}\n`;
    })

    // get variable
    registerBlock(`${categoryPrefix}get`, {
        message0: 'get %1',
        args0: [
            {
                "type": "field_input",
                "name": "NAME",
                "checks": "String"
            }
        ],
        output: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const NAME = block.getFieldValue('NAME');

        const code = [];

        switch (window.vars[NAME].type) {
            case "int":
                code.push(`loadRam ${window.vars[NAME].pointer} r7`);
                code.push("pushReg r7");
                break;
            case "bool":
                code.push(`loadRam ${window.vars[NAME].pointer} r7`);
                code.push("pushReg r7");
                break;
            case "string":
                code.push([
                    `set ${window.vars[NAME].pointer} r5`, // counter
                    `label vars_get_string${window.labelCount}`, // count up till your at the end of the string
                    `loadRamReg r5 r7`,
                    "addReg r5 1 r5",
                    `ifNEqReg r7 0 vars_get_string${window.labelCount}`,
                    'subReg r5 1 r5', // go back to the null terminator
                    `label vars_get_string${window.labelCount+1}`, // count down while pushing the string
                    `loadRamReg r5 r7`,
                    "pushReg r7",
                    "subReg r5 1 r5",
                    `ifGrEqReg r5 ${window.vars[NAME].pointer} vars_get_string${window.labelCount+1}`
                ].join("\n"));
                window.labelCount += 2;
                break;
        }

        return [`${code.join("\n")}\n`, javascriptGenerator.ORDER_ATOMIC];
    })
}

export default register;
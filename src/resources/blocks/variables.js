import javascriptGenerator from '../javascriptGenerator';
import registerBlock from '../register';

const categoryPrefix = 'variable_';
const categoryColor = '#FF8C1A';

function register() {
    // define variable
    registerBlock(`${categoryPrefix}define`, {
        message0: 'define int %1',
        args0: [
            {
                "type": "input_value",
                "name": "NAME",
                "checks": "String"
            }
        ],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const NAME = javascriptGenerator.valueToCode(block, 'NAME', javascriptGenerator.ORDER_ATOMIC);
        const code = [
            "loadRam 0 r7", // load free space pointer into r7
            "saveRamReg_ 0 r7", // save 0 into ram as a placeholder
            "copy r7 r6", // copy r7 into r6
            "add r6 1", // add 1 to r6 (size of int)
            "saveRamReg r6 0" // save r6 into ram
        ].join("\n");

        

        return `${code}\n`;
    })

    // set variable
    registerBlock(`${categoryPrefix}set`, {
        message0: 'set %1 to %2',
        args0: [
            {
                "type": "input_value",
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
        const NAME = javascriptGenerator.valueToCode(block, 'NAME', javascriptGenerator.ORDER_ATOMIC);
        const VAR = javascriptGenerator.valueToCode(block, 'VAR', javascriptGenerator.ORDER_ATOMIC);
        const code = `variables[${NAME || '""'}] = ${VAR || '""'}`;
        return `${code}\n`;
    })

    // get variable
    registerBlock(`${categoryPrefix}get`, {
        message0: 'get %1',
        args0: [
            {
                "type": "input_value",
                "name": "NAME",
                "checks": "String"
            }
        ],
        output: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const NAME = javascriptGenerator.valueToCode(block, 'NAME', javascriptGenerator.ORDER_ATOMIC);
        return [`variables[${NAME || '""'}]`, javascriptGenerator.ORDER_ATOMIC];
    })
}

export default register;
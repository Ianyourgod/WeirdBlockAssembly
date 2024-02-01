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
            pointer: window.memPointer
        }
        window.memPointer++;

        // define doesnt *actually* do anything, but it 'allocates' a space in memory
        return ``;
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
            pointer: window.memPointer
        }
        window.memPointer++;

        // define doesnt *actually* do anything, but it 'allocates' a space in memory
        return ``;
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
            length: LENGTH
        }
        window.memPointer += LENGTH+1;

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
        
        const code = [
            `${VAR}`, // get the value (rember this returns a pointer)
            `saveRamReg r7 ${window.vars[NAME].pointer}\n` // save the pointer into the variable
        ].join("\n");

        return code;
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

        return [`loadRam ${window.vars[NAME].pointer} r7\n`, javascriptGenerator.ORDER_ATOMIC]
    })
}

export default register;
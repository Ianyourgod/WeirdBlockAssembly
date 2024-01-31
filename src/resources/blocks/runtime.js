import javascriptGenerator from '../javascriptGenerator';
import registerBlock from '../register';

const categoryPrefix = 'runtime_';
const categoryColor = '#FFBF00';

function register() {
    // setInterval
    registerBlock(`${categoryPrefix}onstart`, {
        message0: 'On start %1 %2',
        args0: [
            {
                "type": "input_dummy"
            },
            {
                "type": "input_statement",
                "name": "BLOCKS"
            }
        ],
        inputsInline: true,
        colour: categoryColor,
    }, (block) => {
        const BLOCKS = javascriptGenerator.statementToCode(block, 'BLOCKS');

        return `label func_start\n${BLOCKS}\n${BLOCKS.includes("\nreturn\n") ? "" : "return\n"}`;
    })

    registerBlock(`${categoryPrefix}return`, {
        message0: 'Return %1',
        args0: [
            {
                "type": "input_value",
                "name": "VALUE"
            }
        ],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const VALUE = javascriptGenerator.valueToCode(block, 'VALUE', javascriptGenerator.ORDER_ATOMIC);

        return `${VALUE}\nreturn\n`;
    });
}

export default register;
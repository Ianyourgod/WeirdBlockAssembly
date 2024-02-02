import javascriptGenerator from '../javascriptGenerator';
import registerBlock from '../register';

const categoryPrefix = 'control_';
const categoryColor = '#FFAB19';

function register() {
    // if <> then {}
    registerBlock(`${categoryPrefix}ifthen`, {
        message0: 'if %1 then %2 %3',
        args0: [
            {
                "type": "input_value",
                "name": "CONDITION",
                "check": "Boolean"
            },
            {
                "type": "input_dummy"
            },
            {
                "type": "input_statement",
                "name": "BLOCKS"
            }
        ],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const CONDITION = javascriptGenerator.valueToCode(block, 'CONDITION', javascriptGenerator.ORDER_ATOMIC);
        const BLOCKS = javascriptGenerator.statementToCode(block, 'BLOCKS');
        // register 7 will be the "return". The value will just be a pointer tho 
        // condition is assumed to be a bool.
        // aka if the value is not 0 it is true
        // also im doing this like c so type is only known to the compiler
        const code = [
            CONDITION,
            `pop r7`, // assume the condition is a bool
            // this means that any non empty string is also true.
            // cool!!!
            `ifEqReg r7 0 if_endif${window.labelCount}`,
            BLOCKS,
            `label if_endif${window.labelCount}`
        ].join("\n");

        window.labelCount++;

        return `${code}\n`;
    })
    // if <> then {} else {}
    registerBlock(`${categoryPrefix}ifthenelse`, {
        message0: 'if %1 then %2 %3 else %4 %5',
        args0: [
            {
                "type": "input_value",
                "name": "CONDITION",
                "check": "Boolean"
            },
            {
                "type": "input_dummy"
            },
            {
                "type": "input_statement",
                "name": "BLOCKS"
            },
            {
                "type": "input_dummy"
            },
            {
                "type": "input_statement",
                "name": "BLOCKS2"
            }
        ],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const CONDITION = javascriptGenerator.valueToCode(block, 'CONDITION', javascriptGenerator.ORDER_ATOMIC);
        const BLOCKS = javascriptGenerator.statementToCode(block, 'BLOCKS');
        const BLOCKS2 = javascriptGenerator.statementToCode(block, 'BLOCKS2');
        
        const code = [
            CONDITION,
            `pop r7`, // assume the condition is a bool
            `ifEqReg r7 0 if_else${window.labelCount}`,
            BLOCKS,
            `jump if_endif${window.labelCount}`,
            `label if_else${window.labelCount}`,
            BLOCKS2,
            `label if_endif${window.labelCount}`
        ].join("\n");

        window.labelCount++;
        
        return `${code}\n`;
    })
}

export default register;

import javascriptGenerator from '../javascriptGenerator';
import registerBlock from '../register';

const categoryPrefix = 'operators_';
const categoryColor = '#3fce29';

function register() {
    registerBlock(`${categoryPrefix}2sideints`, {
        message0: '%1 %2 %3',
        args0: [
            {
                "type": "input_value",
                "name": "LEFT"
            },
            {
                "type": "field_dropdown",
                "name": "OPERATOR",
                "options": [
                    ["+", "addRegs"],
                    ["-", "subRegs"],
                    ["*", "mulRegs"],
                    ["/", "divRegs"],
                    ["%", "modRegs"]
                ]
            },
            {
                "type": "input_value",
                "name": "RIGHT"
            }
        ],
        output: "Number",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const LEFT = javascriptGenerator.valueToCode(block, 'LEFT', javascriptGenerator.ORDER_ATOMIC);
        const RIGHT = javascriptGenerator.valueToCode(block, 'RIGHT', javascriptGenerator.ORDER_ATOMIC);
        const OPERATOR = block.getFieldValue('OPERATOR');

        const code = [
            LEFT, RIGHT,
            "pop r6",
            "pop r7",
            `${OPERATOR} r7 r6 r7`,
            "pushReg r7"
        ].join("\n");

        return [`${code}\n`, javascriptGenerator.ORDER_ATOMIC];
    });

    registerBlock(`${categoryPrefix}2sidebools`, {
        message0: '%1 %2 %3',
        args0: [
            {
                "type": "input_value",
                "name": "LEFT"
            },
            {
                "type": "field_dropdown",
                "name": "OPERATOR",
                "options": [
                    ["==", "ifEqRegs"],
                    ["!=", "ifNEqRegs"],
                    [">", "ifGrRegs"],
                    [">=", "ifGrEqRegs"],
                    ["<", "ifLsRegs"],
                    ["<=", "ifLsEqRegs"]
                ]
            },
            {
                "type": "input_value",
                "name": "RIGHT"
            }
        ],
        output: "Boolean",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const LEFT = javascriptGenerator.valueToCode(block, 'LEFT', javascriptGenerator.ORDER_ATOMIC);
        const RIGHT = javascriptGenerator.valueToCode(block, 'RIGHT', javascriptGenerator.ORDER_ATOMIC);
        const OPERATOR = block.getFieldValue('OPERATOR');

        const code = [
            LEFT, RIGHT,
            "pop r6",
            "pop r7",
            `${OPERATOR} r7 r6 ifelse${window.labelCount}`,
            "push 0",
            `jump ifend${window.labelCount}`,
            `label ifelse${window.labelCount}`,
            "push 1",
            `label ifend${window.labelCount}`
        ].join("\n");

        window.labelCount++;

        return [`${code}\n`, javascriptGenerator.ORDER_ATOMIC];
    });

    registerBlock(`${categoryPrefix}intToString`, {
        message0: 'int to string %1',
        args0: [
            {
                "type": "input_value",
                "name": "VALUE"
            }
        ],
        output: "String",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const VALUE = javascriptGenerator.valueToCode(block, 'VALUE', javascriptGenerator.ORDER_ATOMIC);

        const code = [
            VALUE,
            "pop r7", // get the value
            "push 0", // eol
            `ifNEqReg r7 0 intToString_loop${window.labelCount}`, // check if the number is positive
            "push 48",
            `jump intToString_end${window.labelCount}`,
            `label intToString_loop${window.labelCount}`,
            "modReg r7 10 r6", // get the remainder
            "divReg r7 10 r7", // get the next number
            "addReg r6 48 r6", // convert to ascii
            "pushReg r6", // save the char
            `ifGrReg r7 0 intToString_loop${window.labelCount}`, // loop
            `label intToString_end${window.labelCount}`,
        ].join("\n");

        window.labelCount++;

        return [`${code}\n`, javascriptGenerator.ORDER_ATOMIC];
    });

    registerBlock(`${categoryPrefix}joinStrings`, {
        message0: 'join %1 %2',
        args0: [
            {
                "type": "input_value",
                "name": "LEFT"
            },
            {
                "type": "input_value",
                "name": "RIGHT"
            }
        ],
        output: "String",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const LEFT = javascriptGenerator.valueToCode(block, 'LEFT', javascriptGenerator.ORDER_ATOMIC);
        const RIGHT = javascriptGenerator.valueToCode(block, 'RIGHT', javascriptGenerator.ORDER_ATOMIC);

        const code = [
            RIGHT,
            LEFT,
            "gStackPtr r7", // save the stack pointer for later
            "subReg r7 1 r7", // decrease saved sp
            `label joinStrings_loop${window.labelCount}`,
            "pop r6", // get the char
            `ifEqReg r6 0 joinStrings_loopend${window.labelCount}`, // check if char is eol
            "pushReg r6", // save the char
            "gStackPtr r6", // get the stack pointer
            "subReg r6 1 r6", // decrease sp
            "sStackPtrReg r6", // save the stack pointer
            `jump joinStrings_loop${window.labelCount}`, // loop
            `label joinStrings_loopend${window.labelCount}`,
            "gStackPtr r5", // get the stack pointer
            "addReg r5 2 r5", // increase sp by 2
            "sStackPtrReg r5", // save the stack pointer
            "pop r6", // get the char
            "pop r4", // get rid of the eol
            "pushReg r6", // save the char
            // check if the stack pointer is the same as the saved one
            `ifLsEqRegs r5 r7 joinStrings_loopend${window.labelCount}`,
        ].join("\n");

        window.labelCount++

        return [`${code}\n`, javascriptGenerator.ORDER_ATOMIC];
    });
}

export default register;

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
}

export default register;

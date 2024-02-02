import javascriptGenerator from '../javascriptGenerator';
import registerBlock from '../register';

const categoryPrefix = 'generic_';
const categoryColor = '#5CA4FF';

function register() {
    // number
    registerBlock(`${categoryPrefix}number`, {
        // gets mad at "empty" string (no just text)
        message0: 'int%1',
        args0: [
            {
                "type": "field_number",
                "name": "NUMBER",
                "value": 0
            }
        ],
        output: "Number",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const NUMBER = block.getFieldValue('NUMBER');

        const code = `push ${NUMBER}`

        return [code, javascriptGenerator.ORDER_ATOMIC];
    })
    
    // text
    registerBlock(`${categoryPrefix}string`, {
        // gets mad at "empty" string (no just text)
        message0: 'text%1',
        args0: [
            {
                "type": "field_input",
                "name": "TEXT",
                "text": ""
            }
        ],
        output: "String",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const TEXT = block.getFieldValue('TEXT');

        const code = []

        code.push(`push 0`) // null terminator

        const reveresed = TEXT.split("").reverse()

        const parsed = ""

        for (let i = 0; i < reveresed.length; i++) {
            if (reveresed[i] === "\\") {
                i++
                switch (reveresed[i]) {
                    case "n":
                        code.push(`push 10`)
                        break;
                    case "t":
                        code.push(`push 9`)
                        break;
                    case "\\":
                        code.push(`push 92`)
                        break;
                    default:
                        code.push(`push ${reveresed[i].charCodeAt(0)}`)
                        break;
                }
            } else {
                code.push(`push ${reveresed[i].charCodeAt(0)}`)
            }
        }


        return [code.join("\n"), javascriptGenerator.ORDER_ATOMIC];
    })

    // boolean
    registerBlock(`${categoryPrefix}boolean`, {
        message0: '%1',
        args0: [
            {
                "type": "field_dropdown",
                "name": "STATE",
                "options": [
                    ["True", "1"], 
                    ["False", "0"], 
                ]
            }
        ],
        output: "Boolean",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const val = block.getFieldValue('STATE');
        const code = `push ${val}`
        return [code, javascriptGenerator.ORDER_ATOMIC];
    })
}

export default register;

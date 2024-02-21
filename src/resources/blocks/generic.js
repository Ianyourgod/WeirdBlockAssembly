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

        const parsed = []

        for (let i = 0; i < TEXT.length; i++) {
            if (TEXT[i] === "\\") {
                i++
                if (!TEXT[i]) {
                    parsed.push(92)
                    break;
                }
                switch (TEXT[i]) {
                    case "n":
                        parsed.push(10)
                        break;
                    case "t":
                        parsed.push(9)
                        break;
                    case "\\":
                        parsed.push(92)
                        break;
                    default:
                        parsed.push(TEXT[i].charCodeAt(0))
                        break;
                }
            } else {
                parsed.push(TEXT[i].charCodeAt(0))
            }
        }

        const code = []

        code.push(`push 0`) // null terminator

        const reveresed = parsed.reverse()

        for (const char of reveresed) {
            code.push(`push ${char}`)
        }


        return [code.join("\n"), javascriptGenerator.ORDER_ATOMIC];
    });

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
    });
}

export default register;

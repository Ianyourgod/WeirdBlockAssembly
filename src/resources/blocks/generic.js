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
        const code = [
            "loadRam 0 r7", // load free space pointer into r7
            `saveRamReg_ ${Math.floor(NUMBER)} r7`, // save val into ram and make SURE its a number by converting to int
            "copy r7 r6", // copy r7 into r6
            "addReg r6 1 r6", // add 1 to r6 (size of int)
            "saveRamReg r6 0" // save r6 into ram
        ].join("\n");
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

        const code = [
            `loadRam 0 r7`, // load free space pointer into r7
            `saveRam ${TEXT.length} r7`, // save length into ram
            `copy r7 r6`, // copy r7 into r6
            `addReg r6 ${TEXT.length+1} r6`, // add length+1 to r6 (size of string)
            `saveRamReg r6 0`, // save r6 into ram
            `subReg r6 ${TEXT.length+1} r6`, // subtract length+1 from r6
        ]

        for (const char of TEXT) {
            code.push(`saveRamReg_ "${char}" r6`);
            code.push(`addReg r6 1 r6`)
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
        const code = [
            "loadRam 0 r7", // load free space pointer into r7
            `saveRamReg_ ${val} r7`, // save val into ram
            "copy r7 r6", // copy r7 into r6
            "addReg r6 1 r6", // add 1 to r6 (size of bool)
            "saveRamReg r6 0", // save r6 into ram
        ].join("\n");
        return [code, javascriptGenerator.ORDER_ATOMIC];
    })
}

export default register;

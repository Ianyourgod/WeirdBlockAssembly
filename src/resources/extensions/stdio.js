import javascriptGenerator from '../javascriptGenerator';
import registerBlock from '../register';

const categoryPrefix = 'stdio_';
const categoryColor = '#1DE';

class Category {
    getCategory() {
        return {
            name: "stdio",
            color: "#1DE",
            blocks: [
                "stdio_printf"
            ]
        }
    }

    registerBlocks() {
        registerBlock(`${categoryPrefix}printf`, {
            message0: 'printf %1',
            args0: [
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
            const VAR = javascriptGenerator.valueToCode(block, 'VAR', javascriptGenerator.ORDER_ATOMIC);
            
            const code = [VAR];
    
            code.push("call stdio_func_printf\npop r4");
    
            return `${code.join("\n")}\n`;
        });

        registerBlock(`${categoryPrefix}scanfint`, {
            message0: 'scanf int into %1',
            args0: [
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
            const VAR = javascriptGenerator.valueToCode(block, 'VAR', javascriptGenerator.ORDER_ATOMIC);
    
            const code = [VAR];

            code.push("call stdio_func_scanf_int\npop r4");
    
            return `${code.join("\n")}\n`;
        });
    }
}

export default Category;
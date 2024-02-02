// compile functions
import raw_randomNumberGen from './randomNumberGen.js?raw';
import raw_compileVarSection from './compileVarSection.js?raw';

import javascriptGenerator from '../javascriptGenerator';
import functions from './functions';

class Compiler {
    /**
     * Generates JavaScript code from the provided workspace & info.
     * @param {Blockly.Workspace} workspace 
     * @param {object} extensionMetadata 
     * @param {object} imageStates 
     * @returns {string} Generated code.
     */
    compile(workspace) {
        const code = "\n".concat(javascriptGenerator.workspaceToCode(workspace));

        const VAR_START = 1;

        window.labelCount = 1;
        window.memPointer = 0 + VAR_START;
        window.vars = {
            "__consoleIndex__": {
                type: "int",
                pointer: 0
            }
        };

        const topCode = [
            "set 0 r0",
            "set 0 r1",
            "set 0 r2",
            "set 0 r3",
            "set 0 r4",
            "set 0 r5",
            "set 0 r6",
            "set 0 r7",

            // set console index
            "saveRamReg 0 0", // isnt really needed but just for clarity
        
            
            "call func_start",
            "pop r7",
            "ifEqReg r7 0 if_else0",
            "  exit_error",
            "label if_else0",
            "  exit_clean",
        ].join("\n")

        const func_code = functions();


        return [
            topCode,
            code,
            `${code.includes("\nlabel func_start\n") ? "" : "label func_start\npush 0\nreturn"}`,
            func_code // TODO: make functions only exist if used
        ].join("\n")
    }
}

export default Compiler;
// compile functions
import raw_randomNumberGen from './randomNumberGen.js?raw';
import raw_compileVarSection from './compileVarSection.js?raw';

import javascriptGenerator from '../javascriptGenerator';

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

        const VAR_START = 100000;

        window.ifCount = 1;
        window.memPointer = 0 + VAR_START;
        window.vars = {};

        const topCode = [
            "saveRam 1 0", 
            // the free space pointer. I'm too lazy to implement a free function so
            // if you run out you're fucked
            "set 0 r0",
            "set 0 r1",
            "set 0 r2",
            "set 0 r3",
            "set 0 r4",
            "set 0 r5",
            "set 0 r6",
            "set 0 r7",
        
            
            "call func_start",
            "ifEqReg r7 0 else0",
            "  exit_error",
            "label else0",
            "  exit_clean",
        ].join("\n")


        return [
            topCode,
            code,
            `${code.includes("\nlabel func_start\n") ? "" : "label func_start\nreturn"}`
        ].join("\n")
    }
}

export default Compiler;
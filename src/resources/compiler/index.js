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
        const code = javascriptGenerator.workspaceToCode(workspace);

        window.ifCount = 0;

        const topCode = [
            "saveRam 0 0", 
            // the free space pointer. I'm too lazy to implement a free function so
            // if you run out you're fucked
            "set r1 0",
            "set r2 0",
            "set r3 0",
            "set r4 0",
            "set r5 0",
            "set r6 0",
            "set r7 0",
        ].join("\n")

        return [
            topCode,
            code
        ].join("\n")
    }
}

export default Compiler;
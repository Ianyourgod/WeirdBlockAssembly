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
            
        ].join("\n")

        return [
            topCode,
            code
        ].join("\n")
    }
}

export default Compiler;
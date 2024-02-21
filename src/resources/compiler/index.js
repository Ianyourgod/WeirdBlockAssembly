import javascriptGenerator from '../javascriptGenerator';
import functions from './functions';
import assembly from './assembly';

class Compiler {

    /**
     * Generates JavaScript code from the provided workspace & info.
     * @param {Blockly.Workspace} workspace 
     * @param {object} extensionMetadata 
     * @param {object} imageStates 
     * @returns {string} Generated code.
     */
    compile(workspace, debug=false) {
        const VAR_START = 1;
        
        window.labelCount = 1;
        window.memPointer = 0 + VAR_START;
        window.vars = {
            "__consoleIndex__": {
                type: "int",
                pointer: 0
            }
        };

        const code = "\n".concat(javascriptGenerator.workspaceToCode(workspace));

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
            "saveRam 0 0", // isnt really needed but just for clarity
        
            
            "call func_start",
            "pop r7",
            "ifEqReg r7 0 if_else0",
            "  exit_error",
            "label if_else0",
            "  exit_clean",
        ].join("\n")

        const func_code = functions();

        const completeCode = [
            topCode,
            code,
            `${code.includes("\nlabel func_start\n") ? "" : "label func_start\npush 0\nreturn"}`,
            func_code // TODO: make functions only exist if used
        ];

        if (debug) {
            return completeCode.join("\n");
        }

        const newCode = [];

        let completeArray = completeCode.join(" ").split("\n").join(" ").split(" ");

        let i = 0;
        while (i < completeArray.length) {
            if (completeArray[i] === "label") {
                newCode.push(`\nlabel ${completeArray[i + 1]}\n`);
                i += 1;
            }
            else if (assembly[completeArray[i]] !== undefined) {
                newCode.push(assembly[completeArray[i]]);
            }
            else if (completeArray[i] !== "") {
                newCode.push(completeArray[i]);
            }
            i += 1;
        }

        

        return newCode.join(" ");
    }
}

export default Compiler;
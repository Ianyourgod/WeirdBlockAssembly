function functions(window) {
    return [
        "label stdio_func_printf",
            "loadRamReg 0 r5", // load console index
            `label stdio_printf${window.labelCount}`,
            "pop r7", // get the char
            `ifNEqReg r7 92 stdio_printf${window.labelCount}_newline`, // check for newline
            "pop r6", // get the char
            `ifNEqReg r6 110 stdio_printf${window.labelCount}_backslash`, // check for newline
            "modReg r5 80 r4",
            "addReg r5 80 r5",
            "subRegs r5 r4 r5",
            "pop r7",
            `jump stdio_printf${window.labelCount}_newline`,
            `label stdio_printf${window.labelCount}_backslash`,
            "pushReg r6",
            `label stdio_printf${window.labelCount}_newline`,
            `saveCnslRegs r7 r5`,
            "addReg r5 1 r5",
            `ifNEqReg r7 0 stdio_printf${window.labelCount}`,
        "push 0",
        "return",
    ].join("\n");
}

export default functions
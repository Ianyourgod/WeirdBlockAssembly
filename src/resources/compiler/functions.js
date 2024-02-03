function functions() {
    return [
        "label stdio_func_printf",
            "loadRamReg 0 r5", // load console index
            "label stdio_printf", // start of loop
                "pop r7", // get the char
                "ifNEqReg r7 10 stdio_printf_newline", // check for newline
                    "modReg r5 80 r4", // get the remainder
                    "addReg r5 79 r5", // add 79
                    "subRegs r5 r4 r5", // subtract the remainder to be on the next line but minus 1
                    "set 32 r7", // set the char to a space
                    "jump stdio_printf_endspecial", // go past the rest
                "label stdio_printf_newline",
                "ifNEqReg r7 9 stdio_printf_tab", // check for tab
                    "addReg r5 3 r5", // increment the console index by 3
                    "set 32 r7", // set the char to a space
                    "jump stdio_printf_endspecial", // go past the rest
                "label stdio_printf_tab",
                "label stdio_printf_endspecial",
                "saveCnslRegs r7 r5", // write the char to the console
                "addReg r5 1 r5", // increment the console index
            "ifNEqReg r7 0 stdio_printf", // loop
        "push 0",
        "return",
    ].join("\n");
}

export default functions
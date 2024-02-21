function functions() {
    return [
        "label stdio_func_printf",
            "loadRam 0 r5", // load console index
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
                "ifEqReg r7 0 stdio_printf_end", // exit loop if needed
                "saveCnslRegs r7 r5", // write the char to the console
                "addReg r5 1 r5", // increment the console index
            "jump stdio_printf", // loop
        "label stdio_printf_end",
        "saveRamReg r5 0", // save the console index
        "push 0",
        "return",

        "label stdio_func_scanf_int",
            // idea here is we let the user type stuff in, print it out, then give it to the program when enter is pressed
            "pop r7", // get the pointer
            "set 0 r6", // value to zero
            "label stdio_func_scanf_int_loop1",
                "eventWaiting r0", // check if an event is waiting
            "ifEqReg r0 0 stdio_func_scanf_int_loop1", // loop
                "readKey r0", // get the key
                "keyUpReg r0 r3", // check if the event is keyUp
            "ifEqReg r3 1 stdio_func_scanf_int_loop1", // loop
                "ifEqReg r0 5 stdio_func_scanf_int_end", // check for enter
                "ifEqReg r0 4 stdio_func_scanf_int_backspace", // check for backspace
                "pushReg r7", // save r7
                "pushReg r6", // save r6
                "pushReg r0", // save r0
                "push 0", // eol
                "pushReg r0", // key
                "call stdio_func_printf", // print the key
                "pop r4", // we dont care about the exit code
                "pop r0", // get r0
                "pop r6", // get r6
                "pop r7", // get r7
                "subReg r0 48 r0", // convert to int
                "mulReg r6 10 r6", // multiply by the placement
                "addRegs r6 r0 r6", // add to the value
            "jump stdio_func_scanf_int_loop1", // loop
            "label stdio_func_scanf_int_backspace",
                "loadRam 0 r5", // load console index
                "subReg r5 1 r5", // decrease the console index
                "saveCnslReg_ 32 r5", // write a space in the previous char
                "saveRamReg r5 0", // save the console index
                "divReg r6 10 r6", // divide by 10
                "jump stdio_func_scanf_int_loop1", // loop
            "label stdio_func_scanf_int_end",
                "saveRamRegs r6 r7", // save the value
            "push 0",
            "return",


    ].join("\n");
}

export default functions
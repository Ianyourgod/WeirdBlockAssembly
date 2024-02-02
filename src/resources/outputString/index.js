export default (string_pointer) => {
    const code = [
        `set ${string_pointer} r5`, // counter
        `label vars_get_string${window.labelCount}`, // count up till your at the end of the string
        `loadRamReg r5 r7`,
        "addReg r5 1 r5",
        `ifNEqReg r7 0 vars_get_string${window.labelCount}`,
        'subReg r5 1 r5', // go back to the null terminator
        `label vars_get_string${window.labelCount+1}`, // count down while pushing the string
        `loadRamReg r5 r7`,
        "pushReg r7",
        "subReg r5 1 r5",
        `ifGrEqReg r5 ${string_pointer} vars_get_string${window.labelCount+1}`
    ].join("\n");

    window.labelCount += 2;

    return `${code}\n`;
}
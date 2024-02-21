// only run this with node
const fs = require('fs');

const assembly = fs.readFileSync('src/resources/compiler/assembly.txt').toString();

const lines = assembly.split('\n');

const asm = {};

lines.forEach((line) => {
    const [label, n] = line.split(' ');
    asm[label] = parseInt(n);
})

fs.writeFileSync('src/resources/compiler/assembly.json', JSON.stringify(asm, null, 2));
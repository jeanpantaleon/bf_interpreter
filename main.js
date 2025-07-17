import { Parser } from "./parser/parser.mjs";
import { readFileSync } from "fs";

let codeFile;

if (process.argv.length > 3) {
    throw "Too many arguments"
} else if(process.argv.length = 3) {
    try {
        codeFile = readFileSync(process.argv[2], {encoding: "utf-8" })
    } catch (e) {
        console.error(`${e}`)
        process.exit(1)
    }
} else {
    codeFile = readFileSync("./scripts/main.js", {encoding: "utf-8" })
}



let parser = new Parser();

parser.tokenize(codeFile);
parser.interpret();
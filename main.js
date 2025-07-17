import { Parser } from "./parser.mjs";
import { readFileSync } from "fs";

let codeFile = readFileSync("./test.bf", {encoding: "utf-8" })

let parser = new Parser();

parser.tokenize(codeFile);
parser.interpret();
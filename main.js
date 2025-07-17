import { Parser } from "./parser/parser.mjs";
import { readFileSync } from "fs";

let codeFile = readFileSync("./scripts/test.bf", {encoding: "utf-8" })

let parser = new Parser();

parser.tokenize(codeFile);
parser.interpret();
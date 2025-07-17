import { Parser } from "./parser.mjs";

let parser = new Parser();

parser.tokenize("<-");
parser.interpret();

parser.printMemory();
import { Token } from "./tokens.mjs";
import { createInterface } from "readline";

export class Parser {
    tokens = [];

    pointerPosition = 0;
    memorySize = 30000;
    memory = Array(this.memorySize).fill(0);

    input = "";
    inputIndex = 0;

    rl = createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    tokenize = (input) => {
        let chars = input.split("");

        while (chars.length > 0) {
            let char = chars.shift();
            if (/\+/g.test(char)) {
                this.tokens.push(Token.PLUS);
            } else if (/\-/g.test(char)) {
                this.tokens.push(Token.MINUS);
            } else if (/\</g.test(char)) {
                this.tokens.push(Token.LEFT);
            } else if (/\>/g.test(char)) {
                this.tokens.push(Token.RIGHT);
            } else if (/\./g.test(char)) {
                this.tokens.push(Token.DISPLAY);
            } else if (/\[/g.test(char)) {
                this.tokens.push(Token.LOOP_START);
            } else if (/\]/g.test(char)) {
                this.tokens.push(Token.LOOP_END);
            } else if (/\,/g.test(char)) {
                this.tokens.push(Token.INPUT);
            }
        }
        return this.tokens;
    };

    /**
     * First function in the parsing tree
     *
     * @returns an int that represents the tokens eaten by the function
     */
    parseLoop = (tokenList, indexOfLoop) => {
        if (tokenList[indexOfLoop] != Token.LOOP_START) {
            throw `Parsing loop with a bad token: ${tokenList[indexOfLoop]}`;
        }

        let loop_tokens = [];
        let indexInLoop = 1;

        let numberOfLoopInside = 0;

        while (
            tokenList[indexOfLoop + indexInLoop] != Token.LOOP_END ||
            numberOfLoopInside > 0
        ) {
            if (tokenList[indexOfLoop + indexInLoop] == Token.LOOP_START) {
                numberOfLoopInside++;
            } else if (tokenList[indexOfLoop + indexInLoop] == Token.LOOP_END) {
                numberOfLoopInside--;
            }
            loop_tokens.push(tokenList[indexOfLoop + indexInLoop]);
            indexInLoop++;
        }

        let localIndex = 0;
        while (this.memory[this.pointerPosition] > 0) {
            while (localIndex < loop_tokens.length) {
                localIndex += this.parseAction(loop_tokens, localIndex);
            }

            localIndex = 0;
        }

        // + 2 because of the two [ and ] that are not included in the tokenList
        return loop_tokens.length + 2;
    };

    parseAction = (tokenList, indexOfToken) => {
        switch (tokenList[indexOfToken]) {
            case Token.LOOP_START:
                return this.parseLoop(tokenList, indexOfToken);
            case Token.PLUS:
                this.memory[this.pointerPosition] =
                    ++this.memory[this.pointerPosition] % 255;
                break;
            case Token.MINUS:
                this.memory[this.pointerPosition]--;
                if (this.memory[this.pointerPosition] < 0)
                    this.memory[this.pointerPosition] = 255;
                break;
            case Token.LEFT:
                this.pointerPosition--;
                if (this.pointerPosition < 0)
                    this.pointerPosition = this.memorySize - 1;
                break;
            case Token.RIGHT:
                this.pointerPosition = ++this.pointerPosition % this.memorySize;
                break;
            case Token.INPUT:
                if (this.input.length <= this.inputIndex) {
                    break;
                }
                this.memory[this.pointerPosition] = this.input.charCodeAt(
                    this.inputIndex
                );
                this.inputIndex++;
                break;
            case Token.DISPLAY:
                process.stdout.write(
                    String.fromCharCode(this.memory[this.pointerPosition])
                );
                break;
        }

        return 1;
    };

    interpret = async () => {
        if (this.tokens.find((v) => v == Token.INPUT) != undefined) {
            this.rl.question("This programs requires an user input: ", (answer) => {
                this.input = answer;
                this.rl.close();
                let index = 0;
                while (index < this.tokens.length) {
                    index += this.parseAction(this.tokens, index);
                }
                return this.memory;
            });
        } else {
            let index = 0;
            while (index < this.tokens.length) {
                index += this.parseAction(this.tokens, index);
            }
            process.exit(0);
            return this.memory;
        }
    };

    printMemory = () => {
        console.log(this.memory);
    };
}

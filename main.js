let TOKEN;
(function (TOKEN) {
    TOKEN[(TOKEN["PLUS"] = 0)] = "PLUS";
    TOKEN[(TOKEN["MINUS"] = 1)] = "MINUS";
    TOKEN[(TOKEN["LEFT"] = 2)] = "LEFT";
    TOKEN[(TOKEN["RIGHT"] = 3)] = "RIGHT";
    TOKEN[(TOKEN["DISPLAY"] = 4)] = "DISPLAY";
    TOKEN[(TOKEN["LOOP_START"] = 5)] = "LOOP_START";
    TOKEN[(TOKEN["LOOP_END"] = 6)] = "LOOP_END";
})(TOKEN || (TOKEN = {}));

class Parser {
    tokens = [];

    pointerPosition = 0;
	memorySize = 30;
    memory = Array(this.memorySize).fill(0);

    tokenize = (input) => {
        let chars = input.split("");

        while (chars.length > 0) {
            let char = chars.shift();
            if (/\+/g.test(char)) {
                this.tokens.push(TOKEN.PLUS);
            } else if (/\-/g.test(char)) {
                this.tokens.push(TOKEN.MINUS);
            } else if (/\</g.test(char)) {
                this.tokens.push(TOKEN.LEFT);
            } else if (/\>/g.test(char)) {
                this.tokens.push(TOKEN.RIGHT);
            } else if (/\./g.test(char)) {
                this.tokens.push(TOKEN.DISPLAY);
            } else if (/\[/g.test(char)) {
                this.tokens.push(TOKEN.LOOP_START);
            } else if (/\]/g.test(char)) {
                this.tokens.push(TOKEN.LOOP_END);
            } else if (/\s|\t|\n/g.test(char)) {
                continue;
            } else {
                throw new Error(`Unknown token: ${char}`);
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
        if (tokenList[indexOfLoop] != TOKEN.LOOP_START) {
            throw `Parsing loop with a bad token: ${tokenList[indexOfLoop]}`;
        }

        let loop_tokens = [];
        let indexInLoop = 1;

        let numberOfLoopInside = 0;

        while (
            tokenList[indexOfLoop + indexInLoop] != TOKEN.LOOP_END ||
            numberOfLoopInside > 0
        ) {
            if (tokenList[indexOfLoop + indexInLoop] == TOKEN.LOOP_START) {
                numberOfLoopInside++;
            } else if (tokenList[indexOfLoop + indexInLoop] == TOKEN.LOOP_END) {
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
            case TOKEN.LOOP_START:
                return this.parseLoop(tokenList, indexOfToken);
            case TOKEN.PLUS:
                this.memory[this.pointerPosition] =
                    ++this.memory[this.pointerPosition] % 255;
                break;
            case TOKEN.MINUS:
                this.memory[this.pointerPosition]--;
                if (this.memory[this.pointerPosition] < 0)
                    this.memory[this.pointerPosition] = 255;
                break;
            case TOKEN.LEFT:
                this.pointerPosition--;
				if(this.pointerPosition < 0)
					this.pointerPosition = this.memorySize - 1
                break;
            case TOKEN.RIGHT:
                this.pointerPosition = ++this.pointerPosition % this.memorySize
                break;
            case TOKEN.DISPLAY:
                console.log(this.memory[this.pointerPosition]);
                break;
        }

        return 1;
    };

    interpret = () => {
        let index = 0;
        while (index < this.tokens.length) {
            index += this.parseAction(this.tokens, index);
        }

        return this.memory;
    };

    print = () => {
        console.log(this.memory);
    };
}

let i = 0;

let parser = new Parser();

parser.tokenize("++[>+++++[>+++++<-]<-]");

parser.interpret();
parser.print();
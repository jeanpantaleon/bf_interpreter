let TOKEN
(function(TOKEN) {
    TOKEN[TOKEN["PLUS"] = 0] = "PLUS";
    TOKEN[TOKEN["MINUS"] = 1] = "MINUS";
    TOKEN[TOKEN["LEFT"] = 2] = "LEFT";
    TOKEN[TOKEN["RIGHT"] = 3] = "RIGHT";
    TOKEN[TOKEN["DISPLAY"] = 4] = "DISPLAY";
    TOKEN[TOKEN["LOOP_START"] = 5] = "LOOP_START";
    TOKEN[TOKEN["LOOP_END"] = 6] = "LOOP_END";
})(TOKEN || (TOKEN = {}));

class Parser {
    tokens = [];

    pointerPosition = 0;7
    memory = Array(30).fill(0);

    tokenize = (input) => {
        let chars = input.split("");
    
        while (chars.length > 0) {
            let char = chars.shift();
            if(/\+/g.test(char)) {
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
            } else {
                throw new Error(`Unknown token: ${char}`);
            }
        }
        return this.tokens;
    }

    parseLoop = () => {
        if(this.tokens[0] != TOKEN.LOOP_START) {
            return this.parseAction(this.tokens.shift())
        }

        console.log("Starting loop")
    
        this.tokens.shift();
        let loopStart = this.pointerPosition;
        let loopEnd = 0;
        let littlePosition = 0;
        while(this.memory[loopStart] > 0 && this.tokens.length > 0) {
            if(this.tokens[littlePosition] == TOKEN.LOOP_END) {
                loopEnd = this.pointerPosition + littlePosition;
                littlePosition = 0;
            }
            this.parseAction(this.tokens[littlePosition]);
            littlePosition++;
        }
        this.tokens = this.tokens.slice(loopEnd, this.tokens.length)
        console.log(this.tokens)
    }
    
    parseAction = (token) => {
        switch(token) {
            case TOKEN.PLUS:
                this.memory[this.pointerPosition] = ++this.memory[this.pointerPosition] % 255;
                break;
            case TOKEN.MINUS:
                this.memory[this.pointerPosition]--;
                if(this.memory[this.pointerPosition] < 0)
                    this.memory[this.pointerPosition] = 255
                break;
            case TOKEN.LEFT:
                this.pointerPosition--;
                break;
            case TOKEN.RIGHT:
                this.pointerPosition++;
                break;
            case TOKEN.DISPLAY:
                console.log(this.memory[this.pointerPosition]);
                break;
            case TOKEN.LOOP_START:
                this.parseLoop();
        }
    }

    interpret = () => {    
        while(this.tokens.length > 0) {
            this.parseLoop();
        }
    
        return this.memory;
    }

    print = () => {
        console.log(this.memory)
    }
}

let i = 0;

let parser = new Parser()

parser.tokenize("");

parser.interpret();
parser.print();
console.log(parser.pointerPosition)
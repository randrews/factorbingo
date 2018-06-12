class Game {
    constructor() {
        this.deck = [];
        this.board = [];
        this.scores = {};
        this.messages = [];

        const sorted = [];
        for(let n=0; n<40; n++) {
            sorted[n] = n % 10;
        }

        for(let n=0; n<40; n++) {
            const idx = this.rand(sorted.length);
            this.deck[n] = sorted.splice(idx, 1)[0];
        }
    }

    rand(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }

    print(puts = console.log) {
        puts(`Scores: 2x${this.scores[2]} 3x${this.scores[3]} 5x${this.scores[5]} 7x${this.scores[7]}\n`);
        puts('Board:\n');

        let str = '';
        for(let n=0; n<16; n++) {
            str += (this.board[n] == null ? '-' : this.board[n]);
            if(n%4 === 3) str += '\n';
        }
        puts(str);

        puts(`Next move: ${this.deck[0]}`);
    }

    move(cell) {
        if(cell < 0 || cell >= 16) return false;
        if(this.board[cell] != null) return false;
        this.board[cell] = this.deck.shift();

        let toDel = [];

        const lines = [
            [0, 5, 10, 15], [3, 6, 9, 12],
            [0, 1, 2, 3], [4, 5, 6, 7], [8, 9, 10, 11], [12, 13, 14, 15],
            [0, 4, 8, 12], [1, 5, 9, 13], [2, 6, 10, 14], [3, 7, 11, 15],
        ];

        this.messages = [];

        lines.forEach((line) => {
            if(this.filled(line)) {
                toDel = toDel.concat(line);
                this.score(line);
            }
        });


        const message = [];
        this.writeMessage(message);
        toDel.forEach(i => this.board[i] = null);
    }

    score(line) {
        let sum = 0;
        const addends = [];
        line.forEach( i => {
            sum += this.board[i]
            addends.push(this.board[i]);
        });

        const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31];

        const divisors = [];
        primes.forEach(p => {
            if(sum % p == 0 && sum >= p) {
                divisors.push(p);
                if(this.scores[p] == null) this.scores[p] = 1;
                else this.scores[p]++;
            }
        });

        this.messages.push(`Scored ${addends.join('+')} = ${sum}, divisible by ${this.toSentence(divisors)}`);
    }

    toSentence(arr) {
        if(arr.length == 0)
            return '';
        else if(arr.length == 1)
            return arr[0];
        else if(arr.length == 2)
            return `${arr[0]} and ${arr[1]}`;
        else {
            let str = '';
            for(let n = 0; n < arr.length - 1; n++) {
                str += `${arr[n]}, `;
            }
            str += `and ${arr[arr.length-1]}`;

            return str;
        }
    }

    filled(cells) {
        return cells.every(i => (this.board[i] != null));
    }

    totalScore() {
        const factors = [];
        for(var k in this.scores) {
            factors.push(k);
        }
        if(factors.length == 0)
            return '0';
        else {
            const topFactor = Math.max.apply(null, factors);
            return `${topFactor} * ${this.scores[topFactor]} = ${topFactor * this.scores[topFactor]}`;
        }
    }

    writeMessage(points) {
        const phrases = [];
        points.forEach(({factor, points}) => {
            const noun = (points == 1 ? 'point' : 'points');
            phrases.push(`${points} ${noun} in ${factor}`);
        });
        this.message = phrases.join(', ');
    }
}

if(typeof(module) != 'undefined') module.exports = { Game };
class Game {
    constructor() {
        this.deck = [];
        this.board = [];
        this.scores = {2: 0};
        this.message = null;

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

        const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31];

        const message = [];

        lines.forEach((line) => {
            if(this.filled(line)) {
                toDel = toDel.concat(line);
                let sum = 0;
                line.forEach(i => sum += this.board[i]);
                primes.forEach((d) => {
                    const s = this.countFactors(sum, d);
                    if(s > 0) {
                        message.push({ factor: d, points: s });
                        if(this.scores[d] == null) this.scores[d] = 0;
                        this.scores[d] += s;
                    }
                });
            }
        });

        this.writeMessage(message);
        toDel.forEach(i => this.board[i] = null);
    }

    countFactors(n, d) {
        let c = 0;
        while(n % d == 0) {
            c++;
            n /= d;
        }
        return c;
    }

    filled(cells) {
        return cells.every(i => (this.board[i] != null));
    }

    totalScore() {
        const scores = [];
        for(var k in this.scores) scores.push(this.scores[k]);
        return Math.min.apply(null, scores);
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
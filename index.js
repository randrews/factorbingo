let game = null;
const find = id => document.getElementById(id);

function init() {
    game = new Game();
    createBoard();
    display(game);
}

function cellClicked() {
    const index = this.getAttribute('index');
    game.move(index);
    display(game);
}

function createBoard() {
    board = find('board');

    for(var n = 0; n<16; n++){
        let cell = document.createElement('div');
        cell.id = `cell-${n}`;
        cell.addEventListener('click', cellClicked);
        cell.setAttribute('index', n)
        if(n % 4 == 0) cell.style = 'clear: left;';
        board.appendChild(cell);
    }
}

function createScore(factor) {
    const div = document.createElement('div');
    div.textContent = `${factor}s: `;
    const span = document.createElement('span');
    span.id = `score-${factor}`;
    div.appendChild(span);
    find('score-container').appendChild(div);
    return span;
}

function syncScores(scores) {
    let keys = [];
    for(var d in scores) {
        keys.push(d);
    }
    const maxFactor = Math.max.apply(null, keys);

    const mapping = d3.select('#score-container').selectAll('div').data(keys);
    mapping.enter().append('div');
    mapping.exit().remove();
    d3.select('#score-container').selectAll('div').data(keys)
        .text(s => `${s}s: ${scores[s]}`)
        .style('text-decoration', s => (s == maxFactor ? '' : 'line-through'));
}

function display(game) {
    syncScores(game.scores);

    find('next-number').textContent = game.deck[0];
    find('total-score').textContent = game.totalScore();
    find('moves-left').textContent = game.deck.length;
    find('message').textContent = game.messages.join("\n");

    for(var n=0; n<16; n++) {
        find(`cell-${n}`).textContent = (game.board[n] == null ? '-' : game.board[n]);
    }
}

if(document.readyState !== 'loading') {
    init();
} else {
    document.addEventListener('DOMContentLoaded', init);
}

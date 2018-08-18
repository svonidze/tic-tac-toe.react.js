import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'

function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        return <Square
            value={this.props.squares[i]}
            onClick={() => this.props.onClick(i)} />;
    }

    render() {
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}

class Game extends React.Component {
    firstPlayerName = 'X';

    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                currentPlayerName: this.firstPlayerName,
            }],
            currentPlayerName: this.firstPlayerName,
            winnerPlayerName: null,
            stepNumber: 0
        }
    }

    getNextPlayerName(currentPlayerName) {
        return currentPlayerName === this.firstPlayerName
            ? 'O'
            : this.firstPlayerName;
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (squares[i] || this.state.winnerPlayerName)
            return;

        squares[i] = this.state.currentPlayerName;
        let state = Object.assign({}, this.state,
            {
                history: history.concat([{
                    squares: squares,
                    currentPlayerName: this.state.currentPlayerName
                }]),
                stepNumber: history.length,
            });

        const winner = calculateWinner(squares);
        if (winner) {
            state.winnerPlayerName = winner;
            this.setState(state);
            return;
        }

        state.currentPlayerName = this.getNextPlayerName(state.currentPlayerName);

        this.setState(state);
    }

    jumpTo(step) {
        const historyItem = this.state.history[step];
        this.setState({
            stepNumber: step,
            currentPlayerName: historyItem.currentPlayerName
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const status = this.state.winnerPlayerName
            ? `Congratilation! Player ${this.state.winnerPlayerName} won!`
            : `Player ${this.state.currentPlayerName}, your turn!`;

        const moves = history.map((step, move) => {
            const desc = move ?
                `Go to move #${move}` :
                'Go to game start';
            return (
                <li key={'history-item' + move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)} />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}  
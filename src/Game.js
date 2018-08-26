import React from 'react';

import Board from "./Board";

import './index.css'

class Game extends React.Component {
    firstPlayerName = 'X';
    boardRowNumber = 3;
    boardColumnNumber = 3;

    constructor(props) {
        super(props);

        const createArray = (row, column) => {
            let array = Array(row).fill(null);
            for (let i in array) {
                array[i] = Array(column).fill(null);
            }
            return array;
        };

        this.state = {
            rounds: [{
                squares: createArray(this.boardRowNumber, this.boardColumnNumber),
                lastPlayerName: null,
                winnerPlayerName: null,
                
            }],
            currentPlayerName: this.firstPlayerName,
            stepNumber: 0
        }
    }

    getNextPlayerName(currentPlayerName) {
        return currentPlayerName === this.firstPlayerName
            ? 'O'
            : this.firstPlayerName;
    }

    handleClick(rowNum, columnNum) {
        const rounds = this.state.rounds.slice(0, this.state.stepNumber + 1);
        const lastRound = rounds[rounds.length - 1];
        const squares = Array(this.boardRowNumber).fill(null);
        for(let i in squares) {
            squares[i] = lastRound.squares[i].slice();
        }
        
        if (squares[rowNum][columnNum] || lastRound.winnerPlayerName)
            return;

        const currentPlayerName = this.state.currentPlayerName;
        squares[rowNum][columnNum] = currentPlayerName;
        const newRound = {
            squares: squares,
            lastPlayerName: currentPlayerName,
        };
        let state = //Object.assign({}, this.state,
            {
                rounds: rounds.concat([newRound]),
                stepNumber: rounds.length,
                currentPlayerName: this.getNextPlayerName(currentPlayerName)
            };
        
        const winner = calculateWinner(squares);
        if (winner) {
            newRound.winnerPlayerName = winner;
        }

        this.setState(state);
    }

    jumpTo(step) {
        const rounds = this.state.rounds.slice(0, step + 1);
        const round = rounds[step];
        this.setState({
            rounds: rounds,
            stepNumber: step,
            currentPlayerName: this.getNextPlayerName(round.lastPlayerName)
        });
    }

    render() {
        console.log('Game', 'render');
        const rounds = this.state.rounds;
        const round = rounds[this.state.stepNumber];
        const winnerPlayerName = round.winnerPlayerName;
        const status = winnerPlayerName
            ? `Congratilation! Player ${winnerPlayerName} won!`
            : `Player ${this.state.currentPlayerName}, your turn!`;

        const moves = rounds.map((round, move) => {
            const desc = move ?
                `Go to move #${move}. ${round.lastPlayerName}` :
                'Go to game start';
            return (
                <li key={'rounds-item' + move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={round.squares}
                        onClick={(rowNum, columnNum) => this.handleClick(rowNum, columnNum)} />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}


function calculateWinner(squares) {
    const lines = [
        [{r: 0, c: 0}, {r: 0, c: 1}, {r: 0, c: 2}],
        [{r: 1, c: 0}, {r: 1, c: 1}, {r: 1, c: 2}],
        [{r: 2, c: 0}, {r: 2, c: 1}, {r: 2, c: 2}],

        [{r: 0, c: 0}, {r: 1, c: 0}, {r: 2, c: 0}],
        [{r: 0, c: 1}, {r: 1, c: 1}, {r: 2, c: 1}],
        [{r: 0, c: 2}, {r: 1, c: 2}, {r: 2, c: 2}],

        [{r: 0, c: 0}, {r: 1, c: 1}, {r: 2, c: 2}],
        [{r: 0, c: 2}, {r: 1, c: 1}, {r: 2, c: 0}],
    ];
    
    const getValue = (cell) => squares[cell.r][cell.c];

    for (let [cell1, cell2, cell3] of lines) {
        if (getValue(cell1) 
            && getValue(cell1) === getValue(cell2) 
            && getValue(cell1) === getValue(cell3)) {
            return getValue(cell1);
        }
    }
    return null;
}  

export default Game;
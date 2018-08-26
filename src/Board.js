import React from 'react';

import Square from "./Square";

import './index.css'

class Board extends React.Component {
    renderSquare(rowNum, columnNum) {
        return <Square key={`${rowNum}-${columnNum}`}
            value={this.props.squares[rowNum][columnNum]}
            onClick={() => this.props.onClick(rowNum, columnNum)} />;
    }

    render() {
        console.log('Board', 'render');
        let rows = [];
        for (let rowNum in this.props.squares) {
            let columns = [];
            for (let columnNum in this.props.squares[rowNum]) {
                columns.push(this.renderSquare(rowNum, columnNum));
            }
            rows.push(<div key={rowNum} className="board-row">{columns}</div>);
        }
        return (<div>{rows}</div>);
    }
}

export default Board;
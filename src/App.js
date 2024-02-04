import { useState } from "react";

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {

  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }

    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else { 
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner : " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  const rows = [];

  for (let i = 0; i < 3; i++) {
    const cells = [];

    for (let j = 0; j < 3; j++) {
      cells.push(<Square value={squares[3 * i + j]} onSquareClick={() => handleClick(3 * i + j)} />)
    }
    rows.push(<div className="board-row">{cells}</div>);
  }

  return (
    <>
      <div className="status">{status}</div>
      {rows}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [isDescending, setIsDescending] = useState(true);
  const [moves, setMoves] = useState(mapToMoves(history));

  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
    setMoves(mapToMoves(nextHistory));
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function mapToMoves(arr) {
    
    return (arr.map((squares, move) => {
      let description;

      // If history is in natural order
      if (isDescending) {
        if (move === arr.length - 1) {
          description = 'You are at move #' + move;
        } else if (move > 0) {
          description = 'Go to move #' + move;
        } else {
          description = 'Go to game start';
        }
        
        if (move === arr.length - 1) {
          return (
            <li key={move}>
              {description}
            </li>
          )
        } else {
          return (
            <li key={move}>
              <button onClick={() => jumpTo(move)}>{description}</button>
            </li>
          );
        }
      }
      // In the case history is reversed
      else {
        if (move === arr.length - 1) {
          description = 'Go to game start';
        } else if (move > 0) {
          description = 'Go to move #' + (arr.length - move - 1)
        } else {
          description = 'You are at move #' + (arr.length - move - 1);
        }

        if (move === 0) {
          return (
            <li key={arr.length - move - 1}>
              {description}
            </li>
          )
        } else {
          return (
            <li key={arr.length - move - 1}>
              <button onClick={() => jumpTo(arr.length - move - 1)}>{description}</button>
            </li>
          )
        }
      }
    })
    );
  }
  
  function reverseOrder() {
    setIsDescending(!isDescending);
    if (isDescending) {
      setMoves(mapToMoves(history)); 
    } else {
      setMoves(mapToMoves(history.slice().reverse()));
    }
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <button onClick={reverseOrder}>Toggle ascending or descending</button>
        <ul>{moves}</ul>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (const element of lines) {
    const [a, b, c] = element;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

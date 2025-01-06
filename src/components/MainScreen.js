import React, { useState } from "react";
import "./MainScreen.scss";

const MainScreen = () => {
  const [board, setBoard] = useState(Array(20).fill(null));
  const [randomNumbers, setRandomNumbers] = useState(generateRandomNumbers());
  const [currentNumberIndex, setCurrentNumberIndex] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);

  function generateRandomNumbers() {
    return Array(20)
      .fill(null)
      .map(() => Math.floor(Math.random() * 1000));
  }

  const isValidCell = (index) => {
    if (board.every((num) => num === null)) return true;

    const left = board.slice(0, index).filter((num) => num !== null);
    const right = board.slice(index + 1).filter((num) => num !== null);

    const leftValid =
      left.length === 0 ||
      randomNumbers[currentNumberIndex] > Math.max(...left);
    const rightValid =
      right.length === 0 ||
      randomNumbers[currentNumberIndex] < Math.min(...right);

    return leftValid && rightValid;
  };

  const handleCellClick = (index) => {
    if (gameOver || win || board[index] !== null) return;

    const updatedBoard = [...board];
    updatedBoard[index] = randomNumbers[currentNumberIndex];

    const isSorted = updatedBoard
      .filter((num) => num !== null)
      .every((num, i, arr) => !i || arr[i - 1] <= num);

    if (!isSorted) {
      setGameOver(true);
      setBoard(updatedBoard); // Prikazujemo posljednji broj
      return;
    }

    if (!updatedBoard.includes(null)) {
      setWin(true);
    } else {
      const nextNumberIndex = currentNumberIndex + 1;

      // Provjera da li postoje validne ćelije za sljedeći broj
      const hasValidCells = updatedBoard.some((num, index) => {
        if (num === null) {
          const left = updatedBoard.slice(0, index).filter((n) => n !== null);
          const right = updatedBoard.slice(index + 1).filter((n) => n !== null);

          const leftValid =
            left.length === 0 ||
            randomNumbers[nextNumberIndex] > Math.max(...left);
          const rightValid =
            right.length === 0 ||
            randomNumbers[nextNumberIndex] < Math.min(...right);

          return leftValid && rightValid;
        }
        return false;
      });

      if (!hasValidCells) {
        setGameOver(true);
        setBoard(updatedBoard); // Prikazujemo posljednji broj
      } else {
        setBoard(updatedBoard);
        setCurrentNumberIndex(nextNumberIndex);
      }
    }
  };

  const restartGame = () => {
    setBoard(Array(20).fill(null));
    setRandomNumbers(generateRandomNumbers());
    setCurrentNumberIndex(0);
    setGameOver(false);
    setWin(false);
  };

  return (
    <div className="main-screen">
      <h2>{randomNumbers[currentNumberIndex]}</h2>
      <div className="board">
        <div className="column">
          {board.slice(0, 10).map((num, index) => {
            const valid = gameOver ? false : isValidCell(index);
            return (
              <div
                key={index}
                className={`cell ${num !== null ? "filled" : ""} ${
                  valid ? "valid" : "invalid"
                }`}
                onClick={() => valid && handleCellClick(index)}
              >
                <span className={valid ? "valid" : "invalid"}>{index + 1}</span>
                {num !== null ? num : ""}
              </div>
            );
          })}
        </div>
        <div className="column">
          {board.slice(10).map((num, index) => {
            const valid = gameOver ? false : isValidCell(index + 10);
            return (
              <div
                key={index + 10}
                className={`cell ${num !== null ? "filled" : ""} ${
                  valid ? "valid" : "invalid"
                }`}
                onClick={() => valid && handleCellClick(index + 10)}
              >
                <span className={valid ? "valid" : "invalid"}>
                  {index + 11}
                </span>
                {num !== null ? num : ""}
              </div>
            );
          })}
        </div>
      </div>
      {gameOver && <p className="game-over">You lost hehe</p>}
      {win && <p className="win">How did you do it??? Impossible!</p>}
      <button onClick={restartGame}>Give up and try again.</button>
    </div>
  );
};

export default MainScreen;

import React, { useState, useEffect } from "react";
import Confetti from "react-confetti";
import "./MainScreen.scss";

const MainScreen = ({ settings }) => {
  const validOrderCounts = [5, 10, 20];
  const orderCount = validOrderCounts.includes(settings.orderCount)
    ? settings.orderCount
    : 5;

  const [board, setBoard] = useState(Array(orderCount).fill(null));
  const [randomNumbers, setRandomNumbers] = useState(
    generateRandomNumbers(orderCount, settings.numberRange)
  );
  const [currentNumberIndex, setCurrentNumberIndex] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loadingNumber, setLoadingNumber] = useState(null);

  useEffect(() => {
    const numbers = generateRandomNumbers(orderCount, settings.numberRange);
    setBoard(Array(orderCount).fill(null));
    setRandomNumbers(numbers);
    setCurrentNumberIndex(0);
    setGameOver(false);
    setWin(false);
    setShowModal(false);
    setLoadingNumber(null);
  }, [settings, orderCount]);

  function generateRandomNumbers(count, range) {
    const numbers = new Set();
    while (numbers.size < count) {
      let randomNumber = Math.floor(Math.random() * range);
      while (randomNumber === 0) {
        randomNumber = Math.floor(Math.random() * range); // Generiramo novi broj ako je nula
      }
      numbers.add(randomNumber);
    }
    return Array.from(numbers);
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
      setBoard(updatedBoard);
      setGameOver(true);
      setShowModal(true);
      setLoadingNumber(randomNumbers[currentNumberIndex]);
      return;
    }

    if (!updatedBoard.includes(null)) {
      setWin(true);
      setShowModal(true);
    } else {
      const nextNumberIndex = currentNumberIndex + 1;

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
        setBoard(updatedBoard);
        setGameOver(true);
        setShowModal(true);
        setLoadingNumber(randomNumbers[nextNumberIndex]);
      } else {
        startLoadingEffect(() => {
          setBoard(updatedBoard);
          setCurrentNumberIndex(nextNumberIndex);
        });
      }
    }
  };

  const restartGame = () => {
    const numbers = generateRandomNumbers(orderCount, settings.numberRange);
    setBoard(Array(orderCount).fill(null));
    setRandomNumbers(numbers);
    setCurrentNumberIndex(0);
    setGameOver(false);
    setWin(false);
    setShowModal(false);
    setLoadingNumber(null);
  };

  const startLoadingEffect = (callback) => {
    let counter = 0;
    const interval = setInterval(() => {
      setLoadingNumber(Math.floor(Math.random() * settings.numberRange));
      counter++;
      if (counter > 20) {
        clearInterval(interval);
        setLoadingNumber(null);
        callback();
      }
    }, 20);
  };

  const rows = Math.ceil(Math.ceil(orderCount / 5));

  return (
    <div className="main-screen">
      {win && <Confetti />}
      <div className="main-header">
        <p>
          Welcome to <b>That Numbers Game</b>, a test of skill and luck!
        </p>
        <p>
          Your goal is to place random numbers into a grid in ascending order.
          Sounds easy? Think again!
        </p>
        <p>One wrong move, and it's game over!</p>
      </div>
      <div className="main-game">
        <span className="main-number">
          {loadingNumber !== null
            ? loadingNumber
            : randomNumbers[currentNumberIndex]}
        </span>
        <div
          className="board"
          style={{
            gridTemplateColumns: `repeat(5, 1fr)`,
            gridTemplateRows: `repeat(${rows}, 1fr)`,
          }}
        >
          {board.map((num, index) => {
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
      </div>
      <div className="main-footer">
        <button onClick={restartGame}>Restart</button>
        <div>Jokers</div>
      </div>
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            {win ? (
              <>
                <h2>How did you do it??? Impossible!</h2>
                <p>Congratulations! You won the game!</p>
              </>
            ) : (
              <>
                <h2>You lost hehe</h2>
                <p>Better luck next time!</p>
              </>
            )}
            <button onClick={restartGame}>Try again.</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainScreen;

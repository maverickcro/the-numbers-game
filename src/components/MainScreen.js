import React, { useState, useEffect } from "react";
import Confetti from "react-confetti";
import "./MainScreen.scss";

const MainScreen = ({ settings }) => {
  const [board, setBoard] = useState(Array(settings.orderCount).fill(null));
  const [randomNumbers, setRandomNumbers] = useState(
    generateRandomNumbers(settings.orderCount, settings.numberRange)
  );
  const [currentNumberIndex, setCurrentNumberIndex] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loadingNumber, setLoadingNumber] = useState(null);
  console.log("random numbers", randomNumbers);
  useEffect(() => {
    setBoard(Array(settings.orderCount).fill(null));
    setRandomNumbers(
      generateRandomNumbers(settings.orderCount, settings.numberRange)
    );
    setCurrentNumberIndex(0);
    setGameOver(false);
    setWin(false);
    setShowModal(false);
  }, [settings]);

  function generateRandomNumbers(count, range) {
    const numbers = new Set();
    while (numbers.size < count) {
      const randomNumber = Math.floor(Math.random() * range);
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
      setBoard(updatedBoard); // Prikazujemo posljednji broj
      setCurrentNumberIndex(currentNumberIndex + 1);
      setGameOver(true);
      setShowModal(true);
      return;
    }

    if (!updatedBoard.includes(null)) {
      setWin(true);
      setShowModal(true);
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
        setBoard(updatedBoard); // Prikazujemo posljednji broj
        setCurrentNumberIndex(currentNumberIndex + 1);
        setGameOver(true);
        setShowModal(true);
      } else {
        startLoadingEffect(() => {
          setBoard(updatedBoard);
          setCurrentNumberIndex(nextNumberIndex);
        });
      }
    }
  };

  const restartGame = () => {
    setBoard(Array(settings.orderCount).fill(null));
    setRandomNumbers(
      generateRandomNumbers(settings.orderCount, settings.numberRange)
    );
    setCurrentNumberIndex(0);
    setGameOver(false);
    setWin(false);
    setShowModal(false);
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

  return (
    <>
      <p className="main-number">
        {loadingNumber !== null
          ? loadingNumber
          : randomNumbers[currentNumberIndex]}
      </p>
      <div className="main-screen">
        {win && <Confetti />}
        <div className="board">
          <div className="column">
            {board
              .slice(0, Math.ceil(settings.orderCount / 2))
              .map((num, index) => {
                const valid = gameOver ? false : isValidCell(index);
                return (
                  <div
                    key={index}
                    className={`cell ${num !== null ? "filled" : ""} ${
                      valid ? "valid" : "invalid"
                    }`}
                    onClick={() => valid && handleCellClick(index)}
                  >
                    <span className={valid ? "valid" : "invalid"}>
                      {index + 1}
                    </span>
                    {num !== null ? num : ""}
                  </div>
                );
              })}
          </div>
          <div className="column">
            {board
              .slice(Math.ceil(settings.orderCount / 2))
              .map((num, index) => {
                const valid = gameOver
                  ? false
                  : isValidCell(index + Math.ceil(settings.orderCount / 2));
                return (
                  <div
                    key={index + Math.ceil(settings.orderCount / 2)}
                    className={`cell ${num !== null ? "filled" : ""} ${
                      valid ? "valid" : "invalid"
                    }`}
                    onClick={() =>
                      valid &&
                      handleCellClick(
                        index + Math.ceil(settings.orderCount / 2)
                      )
                    }
                  >
                    <span className={valid ? "valid" : "invalid"}>
                      {index + 1 + Math.ceil(settings.orderCount / 2)}
                    </span>
                    {num !== null ? num : ""}
                  </div>
                );
              })}
          </div>
        </div>
        {showModal && (
          <div className="main-modal">
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
        <button onClick={restartGame}>Give up and try again.</button>
      </div>
    </>
  );
};

export default MainScreen;

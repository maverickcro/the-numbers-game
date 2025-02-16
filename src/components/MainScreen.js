import React, { useState, useEffect, useRef } from "react";
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
  // console.log(randomNumbers);
  const [currentNumberIndex, setCurrentNumberIndex] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loadingNumber, setLoadingNumber] = useState(null);
  const [previousBoard, setPreviousBoard] = useState(null);
  const [previousNumberIndex, setPreviousNumberIndex] = useState(null);
  const [undoUsed, setUndoUsed] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);
  const [replaceUsed, setReplaceUsed] = useState(false);
  const [timer, setTimer] = useState(0);
  const [score, setScore] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    const numbers = generateRandomNumbers(orderCount, settings.numberRange);
    setBoard(Array(orderCount).fill(null));
    setRandomNumbers(numbers);
    setCurrentNumberIndex(0);
    setGameOver(false);
    setWin(false);
    setShowModal(false);
    setLoadingNumber(null);
    setTimer(0);
    setScore(0);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    timerRef.current = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [settings, orderCount]);

  useEffect(() => {
    if (gameOver || win) {
      clearInterval(timerRef.current);
      if (win) {
        calculateScore();
      }
    }
  }, [gameOver, win]);

  function generateRandomNumbers(count, range) {
    const numbers = new Set();
    while (numbers.size < count) {
      let randomNumber = Math.floor(Math.random() * range);
      while (randomNumber === 0) {
        randomNumber = Math.floor(Math.random() * range); // Generate a new number if it's zero
      }
      numbers.add(randomNumber);
    }
    return Array.from(numbers);
  }

  function isValidCell(index) {
    const currentNumber = randomNumbers[currentNumberIndex];

    // Check left side
    for (let i = 0; i < index; i++) {
      if (board[i] !== null && currentNumber <= board[i]) {
        return false;
      }
    }

    // Check right side
    for (let i = index + 1; i < board.length; i++) {
      if (board[i] !== null && currentNumber >= board[i]) {
        return false;
      }
    }

    return true;
  }

  function calculateScore() {
    const maxTime = 600; // 10 minutes
    const timeTaken = timer;
    let decrementRate;

    if (orderCount === 5) {
      decrementRate = 2.7; // Faster decrement for smaller order count
    } else if (orderCount === 10) {
      decrementRate = 1.7; // Moderate decrement for medium order count
    } else {
      decrementRate = 0.7; // Slower decrement for larger order count
    }

    const calculatedScore = Math.max(
      1,
      1000 - Math.floor((timeTaken / maxTime) * 1000 * decrementRate)
    );
    setScore(calculatedScore);
  }

  const handleCellClick = (index) => {
    if (gameOver || win || board[index] !== null) return;

    setPreviousBoard([...board]);
    setPreviousNumberIndex(currentNumberIndex);

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

    setBoard(updatedBoard); // Update the board before checking for win

    if (!updatedBoard.includes(null)) {
      setWin(true);
      setShowModal(true);
    } else {
      const nextNumberIndex = currentNumberIndex + 1;

      // Check if there are valid cells for the next number
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
        setShowModal(true);
        setLoadingNumber(randomNumbers[nextNumberIndex]);
      } else {
        startLoadingEffect(() => {
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
    setTimer(0);
    setScore(0);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    timerRef.current = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);
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

  const handleUndo = () => {
    if (previousBoard && previousNumberIndex !== null && !undoUsed) {
      setBoard(previousBoard);
      setCurrentNumberIndex(previousNumberIndex);
      setPreviousBoard(null);
      setPreviousNumberIndex(null);
      setUndoUsed(true); // Mark undo as used
    }
  };

  const handleHint = () => {
    if (!hintUsed) {
      const bestPosition = findBestPosition(randomNumbers[currentNumberIndex]);
      handleCellClick(bestPosition);
      setHintUsed(true);
    }
  };

  const handleReplaceNumber = () => {
    if (!replaceUsed) {
      const newNumber = generateRandomNumbers(1, settings.numberRange)[0];
      const updatedNumbers = [...randomNumbers];
      updatedNumbers[currentNumberIndex] = newNumber;
      setRandomNumbers(updatedNumbers);
      setReplaceUsed(true);
    }
  };

  const findBestPosition = (number) => {
    const sortedBoard = [...board.filter((num) => num !== null), number].sort(
      (a, b) => a - b
    );
    const position = sortedBoard.indexOf(number);

    let emptyCount = 0;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === null) {
        if (emptyCount === position) {
          return i;
        }
        emptyCount++;
      }
    }
    return -1; // If no valid position
  };

  const rows = Math.ceil(orderCount / 5);

  return (
    <div className="main-screen">
      {win && <Confetti />}
      <div className="main-header">
        <h1>That Numbers Game</h1>
        <p>
          Put random numbers in the grid in order from{" "}
          <b>smallest to biggest</b> to win!
        </p>
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
        <div className="jokers-restart">
          <button onClick={restartGame}>Restart</button>
          {/* <button
          onClick={handleUndo}
          disabled={undoUsed || currentNumberIndex === 0}
        >
          Undo
        </button>
        <button onClick={handleHint} disabled={hintUsed}>
          Hint
        </button>
        <button onClick={handleReplaceNumber} disabled={replaceUsed}>
          Replace Number
        </button> */}
        </div>
        <div className="timer-score">
          <p>Time: {timer} seconds</p>
          {win && <p>Score: {score}</p>}
        </div>
      </div>
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            {win ? (
              <>
                <h3>You SOMEHOW won!!!</h3>
                <p>
                  Score: <strong>{score}</strong> points
                </p>
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

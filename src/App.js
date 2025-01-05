import React, { useState } from "react";
import "./App.css";

const App = () => {
  const [randomNumber, setRandomNumber] = useState(generateRandomNumber());
  const [board, setBoard] = useState(Array(20).fill(null));
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);

  function generateRandomNumber() {
    return Math.floor(Math.random() * 1000);
  }

  const handleCellClick = (index) => {
    if (gameOver || win) return;

    const updatedBoard = [...board];
    if (updatedBoard[index] !== null) {
      alert("Ova pozicija je već zauzeta!");
      return;
    }

    updatedBoard[index] = randomNumber;

    // Provjera ispravnosti reda
    const isSorted =
      updatedBoard.filter((num) => num !== null).join("") ===
      [...updatedBoard.filter((num) => num !== null)]
        .sort((a, b) => a - b)
        .join("");

    if (!isSorted) {
      setGameOver(true);
      alert("Pogrešno! Izgubio si!");
      return;
    }

    if (!updatedBoard.includes(null)) {
      setWin(true);
      alert("Čestitamo! Pobijedio si!");
    } else {
      setBoard(updatedBoard);
      setRandomNumber(generateRandomNumber());
    }
  };

  const restartGame = () => {
    setBoard(Array(20).fill(null));
    setRandomNumber(generateRandomNumber());
    setGameOver(false);
    setWin(false);
  };

  return (
    <div className="App">
      <h1>That Numbers Game</h1>
      <p>
        Nasumični broj: <strong>{randomNumber}</strong>
      </p>
      <div className="board">
        {board.map((num, index) => (
          <div
            key={index}
            className={`cell ${num !== null ? "filled" : ""}`}
            onClick={() => handleCellClick(index)}
          >
            {num !== null ? num : ""}
          </div>
        ))}
      </div>
      {gameOver && <p className="game-over">You lost hehe</p>}
      {win && <p className="win">How did you do it??? Impossible!</p>}
      <button onClick={restartGame}>Give up like a bicc and try again.</button>
    </div>
  );
};

export default App;

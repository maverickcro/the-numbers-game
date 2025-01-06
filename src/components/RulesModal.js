import React from "react";
import "./RulesModal.scss";

const RulesModal = ({ onClose }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Game Rules</h2>
        <p>
          Welcome to "The Numbers Game" – a test of skill and luck! Your goal is
          to place random numbers into a grid in ascending order. Sounds easy?
          Think again!
        </p>
        <p>
          You can only place a number if it fits logically within the sequence.
          One wrong move, and it's game over!
        </p>
        <p>
          Customize your game with Jokers and different grid sizes in Settings.
        </p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default RulesModal;

import React, { useState } from "react";
import "./RulesModal.scss";
import howToPlayGif from "./assets/rules1.gif";

const RulesModal = ({ onClose }) => {
  const [dontShowAgain, setDontShowAgain] = useState(() => {
    return localStorage.getItem("dontShowRulesModal") === "true";
  });

  const handleCheckboxChange = () => {
    setDontShowAgain(!dontShowAgain);
  };

  const handleClose = () => {
    localStorage.setItem("dontShowRulesModal", dontShowAgain);
    onClose();
  };

  return (
    <div className="rules-modal">
      <div className="rules-modal-content">
        <h2>Game Rules</h2>
        <p>
          Put random numbers in the grid in order from{" "}
          <strong>smallest to biggest</strong>.
        </p>
        <p>
          The <strong>more time</strong> you take, the{" "}
          <strong>less score</strong> you will get.
        </p>
        <p>
          Using <strong>jokers</strong> will help but will also{" "}
          <strong>reduce</strong> your score a bit.
        </p>
        <p>If you make a mistake, the game is over.</p>
        <img src={howToPlayGif} alt="How to Play" className="how-to-play" />
        <p>
          Good luck boss!{" "}
          <span role="img" aria-label="fire emoji">
            🔥
          </span>
        </p>
        <div className="checkbox-container">
          <input
            type="checkbox"
            id="dontShowAgain"
            checked={dontShowAgain}
            onChange={handleCheckboxChange}
          />
          <label htmlFor="dontShowAgain">Don't show again</label>
        </div>
        <button onClick={handleClose}>Close</button>
      </div>
    </div>
  );
};

export default RulesModal;

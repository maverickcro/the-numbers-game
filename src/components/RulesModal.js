import React from "react";
import "./RulesModal.scss";

const RulesModal = ({ onClose }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Game Rules</h2>
        <p>Here are the rules of the game...</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default RulesModal;

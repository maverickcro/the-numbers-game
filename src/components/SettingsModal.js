import React, { useState } from "react";
import "./SettingsModal.scss";

const SettingsModal = ({ onClose }) => {
  const [jokersEnabled, setJokersEnabled] = useState(false);
  const [orderCount, setOrderCount] = useState(5);
  const [numberRange, setNumberRange] = useState(100);

  return (
    <div className="settings-modal">
      <div className="modal-content">
        <h2>Settings</h2>
        <div>
          <label>
            <input
              type="checkbox"
              checked={jokersEnabled}
              onChange={() => setJokersEnabled(!jokersEnabled)}
            />
            Enable Jokers
          </label>
        </div>
        <div>
          <label>
            Order Count:
            <select
              value={orderCount}
              onChange={(e) => setOrderCount(Number(e.target.value))}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </label>
        </div>
        <div>
          <label>
            Number Range:
            <select
              value={numberRange}
              onChange={(e) => setNumberRange(Number(e.target.value))}
            >
              <option value={100}>1-100</option>
              <option value={1000}>1-1000</option>
            </select>
          </label>
        </div>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default SettingsModal;

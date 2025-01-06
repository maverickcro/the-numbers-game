import React, { useState, useEffect } from "react";
import "./SettingsModal.scss";

const SettingsModal = ({ onClose, updateSettings }) => {
  const [jokersEnabled, setJokersEnabled] = useState(false);
  const [orderCount, setOrderCount] = useState(6);
  const [numberRange, setNumberRange] = useState(100);

  useEffect(() => {
    const savedSettings = JSON.parse(localStorage.getItem("gameSettings"));
    if (savedSettings) {
      setJokersEnabled(savedSettings.jokersEnabled);
      setOrderCount(savedSettings.orderCount);
      setNumberRange(savedSettings.numberRange);
    }
  }, []);

  const handleSave = () => {
    const newSettings = { jokersEnabled, orderCount, numberRange };
    updateSettings(newSettings);
    localStorage.setItem("gameSettings", JSON.stringify(newSettings));
    onClose();
  };

  return (
    <div className="settings-modal">
      <div className="modal-content">
        <h2>Settings</h2>
        <div className="setting">
          <label>
            <input
              type="checkbox"
              checked={jokersEnabled}
              onChange={() => setJokersEnabled(!jokersEnabled)}
            />
            Enable Jokers
          </label>
        </div>
        <div className="setting">
          <label>Order Count:</label>
          <div className="options">
            {[6, 10, 20].map((count) => (
              <button
                key={count}
                className={`option ${orderCount === count ? "active" : ""}`}
                onClick={() => setOrderCount(count)}
              >
                {count}
              </button>
            ))}
          </div>
        </div>
        <div className="setting">
          <label>Numbers range:</label>
          <div className="options">
            {[100, 1000].map((range) => (
              <button
                key={range}
                className={`option ${numberRange === range ? "active" : ""}`}
                onClick={() => setNumberRange(range)}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
        <button onClick={handleSave}>Save</button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default SettingsModal;

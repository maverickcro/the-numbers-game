import React, { useState } from "react";
import "./Navigation.scss";
import SettingsModal from "./SettingsModal";
import newLogo from "./assets/newLogo.png";

const Navigation = ({ updateSettings }) => {
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  const openSettingsModal = () => {
    setIsSettingsModalOpen(true);
  };

  const closeModals = () => {
    setIsSettingsModalOpen(false);
  };

  return (
    <nav>
      <img
        src={newLogo}
        alt="TNGame Logo"
        className="logo"
        style={{ height: "3rem" }}
      />
      <ul>
        <li>
          <button onClick={openSettingsModal}>Settings</button>
        </li>
      </ul>
      {isSettingsModalOpen && (
        <SettingsModal onClose={closeModals} updateSettings={updateSettings} />
      )}
    </nav>
  );
};

export default Navigation;

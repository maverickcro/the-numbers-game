import React, { useState, useEffect } from "react";
import "./Navigation.scss";
import SettingsModal from "./SettingsModal";
import RulesModal from "./RulesModal";
import newLogo from "./assets/newLogo.png";

const Navigation = ({ updateSettings }) => {
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [showRulesModal, setShowRulesModal] = useState(() => {
    const dontShowAgain = localStorage.getItem("dontShowRulesModal") === "true";
    return !dontShowAgain;
  });

  const openSettingsModal = () => {
    setIsSettingsModalOpen(true);
    setShowRulesModal(false); // Ensure only one modal is open
  };

  const openRulesModal = () => {
    setShowRulesModal(true);
    setIsSettingsModalOpen(false); // Ensure only one modal is open
  };

  const closeModals = () => {
    setIsSettingsModalOpen(false);
    setShowRulesModal(false);
  };

  const closeRulesModal = () => {
    setShowRulesModal(false);
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
          <button onClick={openRulesModal}>Rules</button>
        </li>
        <li>
          <button onClick={openSettingsModal}>Settings</button>
        </li>
      </ul>
      {isSettingsModalOpen && (
        <SettingsModal onClose={closeModals} updateSettings={updateSettings} />
      )}
      {showRulesModal && <RulesModal onClose={closeRulesModal} />}
    </nav>
  );
};

export default Navigation;

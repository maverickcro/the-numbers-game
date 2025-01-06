import React, { useState } from "react";
import "./Navigation.scss";
import RulesModal from "./RulesModal";
import SettingsModal from "./SettingsModal";

const Navigation = ({ updateSettings }) => {
  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  const openRulesModal = () => {
    setIsSettingsModalOpen(false);
    setIsRulesModalOpen(true);
  };

  const openSettingsModal = () => {
    setIsRulesModalOpen(false);
    setIsSettingsModalOpen(true);
  };

  const closeModals = () => {
    setIsRulesModalOpen(false);
    setIsSettingsModalOpen(false);
  };

  return (
    <nav>
      <h1>TNGame</h1>
      <ul>
        <li>
          <button onClick={openRulesModal}>Rules</button>
        </li>
        <li>
          <button onClick={openSettingsModal}>Settings</button>
        </li>
      </ul>
      {isRulesModalOpen && <RulesModal onClose={closeModals} />}
      {isSettingsModalOpen && (
        <SettingsModal onClose={closeModals} updateSettings={updateSettings} />
      )}
    </nav>
  );
};

export default Navigation;

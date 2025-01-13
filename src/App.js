import React, { useState, useEffect } from "react";
import Navigation from "./components/Navigation";
import MainScreen from "./components/MainScreen";
import { Analytics } from "@vercel/analytics/react";
import "./App.css";

const App = () => {
  const defaultSettings = {
    jokersEnabled: false,
    orderCount: 5,
    numberRange: 100,
  };

  const [settings, setSettings] = useState(() => {
    const savedSettings = localStorage.getItem("gameSettings");
    return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem("gameSettings", JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (newSettings) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      ...newSettings,
    }));
  };

  return (
    <div className="app">
      <Analytics />
      <Navigation updateSettings={updateSettings} />
      <MainScreen settings={settings} />
    </div>
  );
};

export default App;

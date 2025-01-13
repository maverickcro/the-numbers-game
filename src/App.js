import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import Navigation from "./components/Navigation";
import MainScreen from "./components/MainScreen";
import { Analytics } from "@vercel/analytics/react";
import "./App.css";
import newLogo from "./components/assets/newLogo.png";

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
    setSettings(newSettings);
  };

  return (
    <div className="App">
      <Helmet>
        <title>That Numbers Game - Test Your Skills and Luck!</title>
        <meta
          name="description"
          content="Play That Numbers Game, a fun and challenging game where you place random numbers in ascending order. Test your skills and luck now!"
        />
        <meta
          property="og:title"
          content="That Numbers Game - Test Your Skills and Luck!"
        />
        <meta
          property="og:description"
          content="Play That Numbers Game, a fun and challenging game where you place random numbers in ascending order. Test your skills and luck now!"
        />
        <meta property="og:image" content={newLogo} />
        <meta property="og:url" content="https://thatnumbersgame.com" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="That Numbers Game - Test Your Skills and Luck!"
        />
        <meta
          name="twitter:description"
          content="Play That Numbers Game, a fun and challenging game where you place random numbers in ascending order. Test your skills and luck now!"
        />
        <meta name="twitter:image" content={newLogo} />
      </Helmet>
      <Navigation updateSettings={updateSettings} />
      <MainScreen settings={settings} />
      <Analytics />
    </div>
  );
};

export default App;

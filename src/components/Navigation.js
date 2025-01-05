import React from "react";
import "./Navigation.scss";

const Navigation = (props) => {
  return (
    <nav>
      <h1>TNGame</h1>
      <ul>
        <li>
          <button onClick={props.openGameRules}>Rules</button>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;

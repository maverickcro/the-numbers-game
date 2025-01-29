import React, { useEffect, useState } from "react";
import supabase from "../supabaseClient";
import "./Leaderboard.scss";

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    const { data, error } = await supabase
      .from("leaderboard")
      .select("*")
      .order("score", { ascending: false })
      .limit(10);

    if (error) {
      console.error("Error fetching leaderboard:", error);
    } else {
      setLeaderboard(data);
    }
  };

  return (
    <div className="leaderboard">
      <h2>Leaderboard</h2>
      <ul>
        {leaderboard.map((entry, index) => (
          <li key={index}>
            {entry.name}: {entry.score} points
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Leaderboard;

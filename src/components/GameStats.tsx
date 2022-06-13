import React from "react";

export default function GameStats(props) {
  const { totalGames, totalWins } = props;
  return (
    <div className="stats-container">
      <div className="game-stats">
          Games Played: {totalGames} - Perfect Scores: {totalWins}
      </div>
    </div>
  );
}

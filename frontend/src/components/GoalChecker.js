import React from "react";

const GoalChecker = ({ wallet, target, setPoints, resetGame }) => {
    if (wallet >= target) {
        let earnedPoints = (wallet - 10000) * 2;
        setPoints(earnedPoints);

        return (
            <div>
                <h2>🎉 Success! You reached your goal! 🎉</h2>
                <h3>⭐ You earned {earnedPoints} points!</h3>
                <button onClick={resetGame}>Restart Game</button>
            </div>
        );
    }
    return null;
};

export default GoalChecker;

import React, { useEffect } from "react";

const Timer = ({ timeLeft, setTimeLeft, resetGame }) => {
    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
            return () => clearInterval(timer);
        } else {
            alert("Time is up! Try again.");
            resetGame();
        }
    }, [timeLeft]);

    return <h3>⏳ Time Left: {timeLeft}s</h3>;
};

export default Timer;

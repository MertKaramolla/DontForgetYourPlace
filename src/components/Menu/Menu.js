import { useState } from "react";
import { Link } from "react-router-dom";

export default function Menu() {

    const [ difficulty, setDifficulty ] = useState("easy");
    const difficulties = ["easy", "medium", "hard", "insane"];

    function handleDifficulty() {
        const currentIndex = difficulties.indexOf(difficulty);
        const nextIndex = (currentIndex + 1) % difficulties.length;
        setDifficulty(difficulties[nextIndex]);
    };

    return (
        <div>
            <h1>DON'T<br/>FORGET<br/>YOUR<br/>PLACE</h1>
            <Link to={`/game/${difficulty}`}>Play</Link>
            <button type="button" onClick={handleDifficulty}>Difficulty: {difficulty}</button>
            <Link to="/highscores">High Scores</Link>
            <Link to="/settings">Settings</Link>
        </div>
    );
};
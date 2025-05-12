import { useState } from "react";
import { Link } from "react-router-dom";

import styles from "./Menu.module.css";

export default function Menu() {

    const [ difficulty, setDifficulty ] = useState("easy");
    const difficulties = ["easy", "medium", "hard", "insane"];

    const colorMap = {
        easy: "green",
        medium: "yellow",
        hard: "orange",
        insane: "red",
    }

    function handleDifficulty() {
        const currentIndex = difficulties.indexOf(difficulty);
        const nextIndex = (currentIndex + 1) % difficulties.length;
        setDifficulty(difficulties[nextIndex]);
    };

    return (
        <div>
            <h1 className={styles.title}>DON'T<br/>FORGET<br/>YOUR<br/>PLACE</h1>
            <div className={styles.buttonContainer}>
                <Link to={`/game/${difficulty}`} className={styles.button}>Play</Link>
            </div>
            <div className={styles.buttonContainer}>
                <button type="button" onClick={handleDifficulty} className={styles.button}>Difficulty: <span className={styles.difficultyText} style={{color: colorMap[difficulty]}}>{difficulty}</span></button>
            </div>
            <div className={styles.buttonContainer}>
                <Link to="/highscores" className={styles.button}>High Scores</Link>
            </div>
            <div className={styles.buttonContainer}>
                <Link to="/settings" className={styles.button}>Settings</Link>
            </div>
            <p className={styles.devTag}>Made by Karamella</p>
        </div>
    );
};
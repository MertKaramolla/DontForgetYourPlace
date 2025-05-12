import { useState } from "react";

import { iconManager } from "../../icons/iconManager";
import styles from "./HighscoreNamer.module.css";

export default function HighscoreNamer({ highScores, setShowHighScoreModal, scoreData}) {

    const [ nameInput, setNameInput ] = useState("");

    const ConfirmIcon = iconManager.ui.confirm;

    function handleClick() {
        scoreData.name = nameInput;
        highScores.current.push(scoreData);
        highScores.current.sort((a, b) => b.score - a.score);
        while (highScores.current.length > 10) {
            highScores.current.pop();
        };
        localStorage.setItem("highscores", JSON.stringify(highScores.current));
        console.log("Highscore set and localStorage updated with: ", scoreData);
        console.log("new highscores are: ", highScores.current);
        setShowHighScoreModal(false);
    };

    return (
        <div className={styles.backdrop}>
            <div className={styles.modalBorder}>
                <div className={styles.modalContainer}>
                    <p className={styles.congratsText}>Congratulations!!!</p>
                    <p className={styles.descriptionText}>You have set a new High Score</p>
                    <label for="playername" className={styles.inputLabel}>Name Your Score:</label>
                    <div className={styles.inputContainer}>
                        <input type="text" name="playername" value={nameInput} onChange={e => setNameInput(e.target.value)} className={styles.nameInput} maxLength="8" />
                        <button type="button" onClick={handleClick} className={styles.confirmButton}>
                            <ConfirmIcon className={styles.confirmIcon} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
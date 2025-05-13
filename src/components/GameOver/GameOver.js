import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { iconManager } from "../../icons/iconManager.js";
import styles from "./GameOver.module.css";

import HighscoreNamer from "./HighscoreNamer.js";

export default function GameOver({ highScores }) {

    const gameOverState = useLocation();
    const { finalScore, difficulty, matches, startTime, endTime, message, livesLeft, hasWon } = gameOverState.state;

    const [ hasInit, setHasInit ] = useState(false);
    const [ scoreDisplay, setScoreDisplay ] = useState(finalScore[1]);
    const [ showHighScoreModal, setShowHighScoreModal ] = useState(false);
    const navigate = useNavigate();


    const config = {
        easy: {
            cardCount: 6,
            timer: 120,
            lives: 4,
        },
        medium: {
            cardCount: 12,
            timer: 120,
            lives: 6,
        },
        hard: {
            cardCount: 16,
            timer: 120,
            lives: 8,
        },
        insane: {
            cardCount: 25,
            timer: 60,
            lives: 6,
        }
    };

    const timeElapsed = Math.floor((endTime - startTime)/1000);
    const timeLeft = config[difficulty].timer - timeElapsed;

    const [extraTime, setExtraTime ] = useState(timeLeft);
    const totalScore = timeLeft + finalScore[1];

    useEffect(() => {
        const timerId = setTimeout(() => {
            if (timeLeft > 1) {
                setHasInit(true);
            };
        }, 2000);

        return () => clearTimeout(timerId);
    }, []);

    useEffect(() => {
        if (!hasInit || !hasWon) return;
        const intervalId = setInterval(() => {
            let done = false;
            setExtraTime(prev => {
                const next = Math.max(prev - 1, 0);
                if (next === 0) done = true;
                return next;
            });
            setScoreDisplay(prev => {
                const next = Math.min(prev + 1, totalScore);
                if (next === totalScore) done = true;
                return next;
            });

            if (done) {
                console.log("my interval is finished");
                checkHighScore();
                clearInterval(intervalId);
            };
        }, 100);

        return () => clearInterval(intervalId);
    }, [hasInit]);

    const MenuIcon = iconManager.ui.exit;
    const ReplayIcon = iconManager.ui.replay;

    function handleReplay() {
        navigate(`/game/${difficulty}`);
    };

    function handleExit() {
        navigate("/");
    };

    function checkHighScore() {
        if (highScores.current.length > 0 && highScores.current[highScores.current.length - 1].score < totalScore) {
            console.log("highscores.current is filled and highscore is valid");
            setShowHighScoreModal(true);
        } else if (highScores.current.length === 0) {
            console.log("highscores.current is empty and highscore is valid");
            setShowHighScoreModal(true);
        };
    };

    const scoreData = {
        score: totalScore,
        difficulty,
        timeElapsed
    };

    const colorMap = {
        easy: "greenyellow",
        medium: "yellow",
        hard: "orange",
        insane: "#BF3131",
    };

    return (
        <div className={styles.container}>
            {showHighScoreModal ? <HighscoreNamer highScores={highScores} setShowHighScoreModal={setShowHighScoreModal} scoreData={scoreData}/> : null}
            <div>
                <p className={hasWon ? styles.congrats : styles.gameover}>{hasWon ? "Congratulations" : "Game Over"}</p>
                <p className={hasWon ? styles.winStatement : styles.loseStatement}>{hasWon ? "You have Won" : "You Lose Bitch"}</p>
                {!hasWon && <p className={styles.lossCondition}>{message}</p>}
                <p className={styles.difficultyStatement}>on <span className={styles.difficultyText} style={{color: colorMap[difficulty]}}>{difficulty}</span> difficulty.</p>
            </div>
            <div className={styles.finalScoreContainer}>
                <p className={styles.finalScoreLabel}>Final Score:</p>
                <p className={styles.finalScoreDisplay}>{scoreDisplay}</p>
                {hasWon && extraTime > 0 ? <p className={styles.finalScoreIncrementor}>time left: {extraTime}s</p> : null}
            </div>
            <div className={styles.dataContainer}>
                {hasWon ? (
                    <>
                        <div className={styles.metaContainer}>
                            <p className={styles.metaData}>Lives Left:</p>
                            <p className={styles.metaData}>{livesLeft}</p>
                        </div>
                        <div className={styles.metaContainer}>
                            <p className={styles.metaData}>Finished in:</p>
                            <p className={styles.metaData}>{timeElapsed}s</p>
                        </div>
                    </>
                ) : <p className={styles.metaData}>Correct Matches: {matches.length} / {config[difficulty].cardCount}</p>}
            </div>
            <div className={styles.buttonContainer}>
                <button type="button" onClick={handleReplay} className={styles.button}><ReplayIcon className={styles.buttonIcon} /> Play Again</button>
            </div>
            <div className={styles.buttonContainer}>
                <button type="button" onClick={handleExit} className={styles.button}><MenuIcon className={styles.buttonIcon} /> Main Menu</button>
            </div>
        </div>
    );
};
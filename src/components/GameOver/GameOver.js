import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { iconManager } from "../../icons/iconManager.js";

import HighscoreNamer from "./HighscoreNamer.js";

export default function GameOver({ highScores }) {

    const gameOverState = useLocation();
    const { finalScore, difficulty, matches, startTime, endTime, message, livesLeft, hasWon } = gameOverState.state;

    const [ hasInit, setHasInit ] = useState(false);
    const [ scoreDisplay, setScoreDisplay ] = useState(finalScore);
    const [ showHighScoreModal, setShowHighScoreModal ] = useState(false);
    const navigate = useNavigate();


    const config = {
        easy: {
            cardCount: 6,
            timer: 120,
            lives: 4
        },
        medium: {
            cardCount: 12,
            timer: 120,
            lives: 6
        },
        hard: {
            cardCount: 16,
            timer: 120,
            lives: 10
        },
        insane: {
            cardCount: 24,
            timer: 60,
            lives: 6
        }
    };

    const timeElapsed = Math.floor((endTime - startTime)/1000);
    const timeLeft = config[difficulty].timer - timeElapsed;

    const [extraTime, setExtraTime ] = useState(timeLeft);
    const totalScore = timeLeft + finalScore;

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

    /* function checkHighScore() {
        const localData = localStorage.getItem("highscores");
        const localHighscores = JSON.parse(localData);
        if (localHighscores && localHighscores.length > 0 && localHighscores[localHighscores.length - 1].score < totalScore) {
            localHighscores.push({
                score: totalScore,
                difficulty,
                timeElapsed
            });
            localHighscores.sort((a, b) => b.score - a.score);
            while (localHighscores.length > 10) {
                localHighscores.pop();
            };
            localStorage.setItem("highscores", JSON.stringify(localHighscores));
        };
    }; */

    return (
        <div>
            {showHighScoreModal ? <HighscoreNamer highScores={highScores} setShowHighScoreModal={setShowHighScoreModal} scoreData={scoreData}/> : null}
            <div>
                <p>{hasWon ? "Congratulations" : "Game Over"}</p>
                <p>{hasWon ? "You have Won" : "You Lose Bitch"}</p>
                {!hasWon && <p>{message}</p>}
                <p>on {difficulty} difficulty</p>
            </div>
            <div>
                <p>Final Score:</p>
                <p>{scoreDisplay}</p>
                {hasWon && extraTime > 0 ? <p>time left: {extraTime}s</p> : null}
            </div>
            <div>
                {hasWon ? (
                    <>
                        <p>Lives Left: {livesLeft}</p>
                        <p>Finished in: {timeElapsed} seconds</p>
                    </>
                ) : <p>Matches: {matches.length} / {config[difficulty].cardCount}</p>}
            </div>
            <button type="button" onClick={handleReplay}><ReplayIcon width="20px" /> Play Again</button>
            <button type="button" onClick={handleExit}><MenuIcon width="20px" /> Main Menu</button>
        </div>
    );
};

// Highscore: FinalScore, difficulty, timeElapsed
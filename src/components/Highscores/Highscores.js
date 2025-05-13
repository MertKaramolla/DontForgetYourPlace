import { useNavigate } from "react-router-dom";
import { iconManager } from "../../icons/iconManager";
import styles from "./Highscores.module.css";

export default function Highscores({ highScores }) {

    const navigate = useNavigate();

    console.log("highScores are: ", highScores.current);

    const ExitIcon = iconManager.ui.exit;

    const colorMap = {
        easy: "greenyellow",
        medium: "yellow",
        hard: "orange",
        insane: "#BF3131",
    };

    function handleClick() {
        navigate("/");
    };

    if (highScores.current.length === 0) {
        return (
            <div>
                <h1 className={styles.emptyHeading}>Highscores</h1>
                <p className={styles.emptyStatement}>You currently have no Highscores. Play the game to earn a place here.</p>
                <ExitIcon className={styles.emptyExit} onClick={handleClick}/>
            </div>
        );
    } else {
        return (
            <div>
                <h1 className={styles.heading}>Highscores</h1>
                <ul className={styles.scoreList}>
                    {highScores.current.map((scoreData, i) => {
                        return (
                            <li key={`highscore-${i}`} className={styles.listItem}>
                                <div className={styles.highScoreContainer}>
                                    <p className={styles.scoreDisplay}>{scoreData.score}</p>
                                    <p className={styles.nameDisplay}>{scoreData.name}</p>
                                    <p className={styles.difficultyDisplay}>on <span className={styles.difficultyValue} style={{color: colorMap[scoreData.difficulty]}}>{scoreData.difficulty}</span></p>
                                </div>
                            </li>
                        );
                    })}
                </ul>
                <ExitIcon className={styles.exitIcon} onClick={handleClick}/>
            </div>
        );
    };
};
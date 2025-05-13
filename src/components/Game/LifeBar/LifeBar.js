import { iconManager } from "../../../icons/iconManager.js";
import styles from "../Game.module.css";

export default function LifeBar({ livesLeft, numberOfLives }) {

    const lifeArray = [];
    const RedHeart = iconManager.ui.redHeart;
    const EmptyHeart = iconManager.ui.blackHeart;
    for (let i = 1; i <= numberOfLives; i++) {
        if (i > livesLeft) {
            lifeArray.push(<EmptyHeart className={styles.lifeIcon} key={`heartIcon-${i}-empty`}/>);
        } else {
            lifeArray.push(<RedHeart className={styles.lifeIcon} key={`heartIcon-${i}-red`}/>);
        };
    };

    return (
        <div className={styles.lifeContainer}>
            {lifeArray}
        </div>
    );
};
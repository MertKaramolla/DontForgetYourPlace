import { useState } from "react";

import styles from "./FlipCard.module.css";

export default function FlipCard({ cardData, selectedCards, setSelectedCards }) {

    const [ showCard, setShowCard ] = useState(false);

    const [ imageId, ImageIcon, cardType, CardIcon ] = cardData;

    let isBlue = false;

    if (cardType === "spades" || cardType === "clubs") {
        isBlue = true;
    };

    function handleClick() {
        setShowCard(!showCard);
    };

    return (
        <div className={showCard ? `${styles["flip-card"]} ${styles.flipped}` : styles["flip-card"]} onClick={handleClick}>
            <div className={styles["flip-card-contents"]}>
                <div className={styles["flip-card-front"]}>
                    <p>front</p>
                </div>
                <div className={`${styles["flip-card-back"]} ${isBlue ? styles.blueCard : styles.redCard}`}>
                    <CardIcon className={`${styles.typeIcon} ${styles.topType}`} />
                    <ImageIcon className={styles.imageIcon} />
                    <CardIcon className={`${styles.typeIcon} ${styles.bottomType}`} />
                </div>
            </div>
        </div>
    );
};

{/* <div className={`${styles.cardContainer} ${isBlue ? styles.blueCard : styles.redCard}`}>
            <CardIcon className={`${styles.typeIcon} ${styles.topType}`} />
            <ImageIcon className={styles.imageIcon} />
            <CardIcon className={`${styles.typeIcon} ${styles.bottomType}`} />
        </div> */}
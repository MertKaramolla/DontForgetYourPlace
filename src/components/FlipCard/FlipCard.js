import { useEffect, useState } from "react";

import styles from "./FlipCard.module.css";
import { iconManager } from "../../icons/iconManager.js";

export default function FlipCard({ cardData, isMatched, isFlipped, selectCard, i, setDeckIsDisplayed }) {

    const [ init, setInit ] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setInit(false);
            if(setDeckIsDisplayed) {setDeckIsDisplayed(true);
            console.log("deck display is set on: ", i)}
        }, 1500 + (100 * i));
    }, []);

    const ImageIcon = cardData.cardImage;
    const CardIcon = cardData.typeImage;

    const CardBackIcon = iconManager.ui.cardBack;


    let isBlue = false;

    if (cardData.id.cardType === "spades" || cardData.id.cardType === "clubs") {
        isBlue = true;
    };

    return isMatched ? (
        <div className={styles["matched-card"]}>
            <CardIcon className={`${styles.typeIcon} ${styles.topType}`} />
            <ImageIcon className={styles.imageIcon} />
            <CardIcon className={`${styles.typeIcon} ${styles.bottomType}`} />
        </div>
        ) : (
        <div className={isFlipped || init ? `${styles["flip-card"]} ${styles.flipped}` : styles["flip-card"]} onClick={init ? null : () => selectCard(isFlipped, cardData.id)}>
            <div className={styles["flip-card-contents"]}>
                <div className={styles["flip-card-front"]}>
                    <CardBackIcon className={styles.frontIcon} />
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


    /*
    cardData = {
        id: {
            imageId: imageArray[extractIndex][0],
            cardType: cardIcon[0],
            match: "a"
        },
        cardImage: imageArray[extractIndex][1],
        typeImage: imageArray[extractIndex][1]
    };
    */
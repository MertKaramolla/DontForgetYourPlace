import { useEffect, useState } from "react";

import styles from "./FlipCard.module.css";
import { iconManager } from "../../icons/iconManager.js";

export default function FlipCard({ cardData, selectedCards, setSelectedCards, matchedCards, i }) {

    const [ init, setInit ] = useState(true);

    useEffect(() => {
        setTimeout(() => setInit(false), 1500 + (100 * i));
    }, []);
    
    const [ firstSelected, secondSelected ] = selectedCards;

    const ImageIcon = cardData.cardImage;
    const CardIcon = cardData.typeImage;

    const CardBackIcon = iconManager.ui.cardBack;


    let isBlue = false;

    if (cardData.id.cardType === "spades" || cardData.id.cardType === "clubs") {
        isBlue = true;
    };

    const isVisible = (
        firstSelected && firstSelected.imageId === cardData.id.imageId && firstSelected.cardType === cardData.id.cardType && firstSelected.match === cardData.id.match
    ) || (
        secondSelected && secondSelected.imageId === cardData.id.imageId && secondSelected.cardType === cardData.id.cardType && secondSelected.match === cardData.id.match
    );

    const isMatched = matchedCards.find(card => {
        return card.imageId === cardData.id.imageId && card.cardType === cardData.id.cardType;
    });

    function handleClick() {
        if (!isVisible) {
            if (selectedCards.length === 0) {
                setSelectedCards([cardData.id]);
            } else if (selectedCards.length === 1) {
                setSelectedCards([...selectedCards, cardData.id])
            };
        };
    };

    return isMatched ? (
        <div className={styles["matched-card"]}>
            <CardIcon className={`${styles.typeIcon} ${styles.topType}`} />
            <ImageIcon className={styles.imageIcon} />
            <CardIcon className={`${styles.typeIcon} ${styles.bottomType}`} />
        </div>
        ) : (
        <div className={isVisible || init ? `${styles["flip-card"]} ${styles.flipped}` : styles["flip-card"]} onClick={init ? null : handleClick}>
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
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import FlipCard from "../FlipCard/FlipCard.js";

import { shuffleArray, createDeck } from "../../utilities/deckBuilder.js";

import styles from "./Game.module.css";

export default function Game() {

    const [ deckIsDisplayed, setDeckIsDisplayed ] = useState(false);
    const [ selectedCards, setSelectedCards ] = useState([]);
    const [ matchedCards, setMatchedCards ] = useState([]);
    const [ userScore, setUserScore ] = useState(0);

    const { difficulty } = useParams();
    const navigate = useNavigate();

    const timerBar = useRef(null);

    let cardCount = null;
    let timer = null;

    switch(difficulty) {
        case "easy":
            cardCount = 6;
            timer = 120;
            break;
        case "medium":
            cardCount = 12;
            timer = 120;
            break;
        case "hard":
            cardCount = 16;
            timer = 60;
            break;
        case "insane":
            cardCount = 24;
            timer = 60;
            break;
        default:
            throw new Error("difficulty is set to unknown value");
    };

    useEffect(() => {
        if (deckIsDisplayed) {
            console.log("init is finished")
            setTimeout(() => {
                navigate("/gameover");
            }, timer * 1000);
            timerBar.current.classList.add(styles.animatedTimer);
            timerBar.current.style.animationDuration = `${timer}s`
            console.log(timerBar.current.style.animation);
        };
    }, [deckIsDisplayed]);

    useEffect(() => {
        console.log("selectedCards is set to: ", selectedCards);
        if (selectedCards.length === 2) {
            console.log("2 cards have been selected");
            const isMatch = selectedCards[0].imageId === selectedCards[1].imageId && selectedCards[0].cardType === selectedCards[1].cardType && selectedCards[0].match !== selectedCards[1].match;
            setTimeout(() => {
                if (isMatch) {
                    console.log("Selected Cards Match");
                    setMatchedCards([...matchedCards, {
                        imageId: selectedCards[0].imageId,
                        cardType: selectedCards[0].cardType
                    }]);
                    setUserScore(prev => prev + 2);
                    setSelectedCards([]);
                } else {
                    console.log("Selected Cards do not match");
                    setUserScore(prev => prev - 1);
                    setSelectedCards([]);
                };
            }, 1000);
        };
    }, [selectedCards]);

    useEffect(() => {
        if (matchedCards.length === cardCount) {
            setTimeout(() => {
                navigate("/gameover");
            }, 1000);
        };
    }, [matchedCards, cardCount]);

    const shuffledCards = useMemo(() => {
        const deck = createDeck(cardCount);
        return shuffleArray(deck);
    }, [cardCount]);

    function selectCard(flipped, id) {
        if (!flipped) {
            if (selectedCards.length === 0) {
                setSelectedCards([id]);
            } else if (selectedCards.length === 1) {
                setSelectedCards([...selectedCards, id])
            };
        };
    };

    return (
        <div>
            <div className={styles.timerBar} ref={timerBar}></div>
            <p>Game Started at {difficulty}</p>
            <p>Score is: {userScore}</p>
            <div style={{display: "flex", flexWrap: "wrap"}}>
                {shuffledCards.map((cardData, i) => {

                    const [ firstSelected, secondSelected ] = selectedCards;
                    const isFlipped = (
                        firstSelected && firstSelected.imageId === cardData.id.imageId && firstSelected.cardType === cardData.id.cardType && firstSelected.match === cardData.id.match
                    ) || (
                        secondSelected && secondSelected.imageId === cardData.id.imageId && secondSelected.cardType === cardData.id.cardType && secondSelected.match === cardData.id.match
                    );

                    const isMatched = matchedCards.find(card => {
                        return card.imageId === cardData.id.imageId && card.cardType === cardData.id.cardType;
                    });

                    return <FlipCard cardData={cardData} isMatched={isMatched} isFlipped={isFlipped} selectCard={selectCard} i={i} key={`flipcard-${i}`} setDeckIsDisplayed={i === shuffledCards.length - 1 ? setDeckIsDisplayed : null}/>;
                })}
            </div>
        </div>
    );
};
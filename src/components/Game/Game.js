import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import FlipCard from "./FlipCard/FlipCard.js";
import LifeBar from "./LifeBar/LifeBar.js";

import { shuffleArray, createDeck } from "../../utilities/deckBuilder.js";

import styles from "./Game.module.css";
import { iconManager } from "../../icons/iconManager.js";

export default function Game() {

    const [ deckIsDisplayed, setDeckIsDisplayed ] = useState(false);
    const [ selectedCards, setSelectedCards ] = useState([]);
    const [ matchedCards, setMatchedCards ] = useState([]);
    const [ userScore, setUserScore ] = useState(0);

    const { difficulty } = useParams();
    const navigate = useNavigate();

    const timerBar = useRef(null);
    const startTime = useRef(null);

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

    const [ livesLeft, setLivesLeft ] = useState(config[difficulty].lives);

    const cardCount = config[difficulty].cardCount;
    const timer = config[difficulty].timer;

    const endGame = useCallback((message, win) => {
        navigate("/gameover", {
            state: {
                finalScore: userScore,
                difficulty,
                matches: matchedCards,
                startTime: startTime.current,
                endTime: Date.now(),
                message,
                livesLeft: livesLeft,
                hasWon: win
            }
        })
    }, [userScore, matchedCards, difficulty, navigate, livesLeft])

    useEffect(() => {
        if (!deckIsDisplayed) return;
        startTime.current = Date.now();
        console.log("init is finished")
        const timerId = setTimeout(() => {
            endGame("you ran out of time", false);
        }, timer * 1000);
        timerBar.current.classList.add(styles.animatedTimer);
        timerBar.current.style.animationDuration = `${timer}s`

        return () => clearTimeout(timerId)
    }, [deckIsDisplayed]);

    useEffect(() => {
        console.log("selectedCards is set to: ", selectedCards);
        if (selectedCards.length !== 2) return;
        console.log("2 cards have been selected");
        const isMatch = selectedCards[0].imageId === selectedCards[1].imageId && selectedCards[0].cardType === selectedCards[1].cardType && selectedCards[0].match !== selectedCards[1].match;
        const timeoutId = setTimeout(() => {
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
                setLivesLeft(prev => prev - 1);
                setSelectedCards([]);
            };
        }, 1000);

        return () => clearTimeout(timeoutId);
    }, [selectedCards]);

    useEffect(() => {
        if (matchedCards.length !== cardCount) return;
        
        const timerId = setTimeout(() => {
            endGame("Congratulations, You Won!", true);
        }, 1000);

        return () => clearTimeout(timerId);

    }, [matchedCards, cardCount]);

    useEffect(() => {
        if (livesLeft !== 0) return;
        
        const timerId = setTimeout(() => {
            endGame("you ran out of lives", false);
        }, 1000);

        return () => clearTimeout(timerId);
    }, [livesLeft]);

    const ExitIcon = iconManager.ui.exit;

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

    function handleExit() {
        navigate("/");
    };

    return (
        <div>
            <div className={styles.timerBar} ref={timerBar}></div>
            <ExitIcon className={styles.exitIcon} onClick={handleExit} />
            <p>Game Started at {difficulty}</p>
            <LifeBar livesLeft={livesLeft} numberOfLives={config[difficulty].lives} />
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
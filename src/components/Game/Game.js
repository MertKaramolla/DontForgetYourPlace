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
    const [ userScore, setUserScore ] = useState([0, 0]);
    const [ showIncreaser, setShowIncreaser ] = useState(false);
    const [ showDecreaser, setShowDecreaser ] = useState(false);

    const { difficulty } = useParams();
    const navigate = useNavigate();

    const timerBar = useRef(null);
    const startTime = useRef(null);

    const config = {
        easy: {
            cardCount: 6,
            timer: 120,
            lives: 4,
            grid: {
                template: "repeat(3, 1fr) / repeat(4, 1fr)",
                cardWidth: "150px",
                cardHeight: "255px"
            }
        },
        medium: {
            cardCount: 12,
            timer: 120,
            lives: 6,
            grid: {
                template: "repeat(3, 1fr) / repeat(8, 1fr)",
                cardWidth: "150px",
                cardHeight: "255px"
            }
        },
        hard: {
            cardCount: 16,
            timer: 120,
            lives: 8,
            grid: {
                template: "repeat(4, 1fr) / repeat(8, 1fr)",
                cardWidth: "112px",
                cardHeight: "191px"
            }
        },
        insane: {
            cardCount: 25,
            timer: 60,
            lives: 6,
            grid: {
                template: "repeat(4, 1fr) / repeat(10, 1fr)",
                cardWidth: "90px",
                cardHeight: "153px"
            }
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
                setUserScore(([ prev, cur ]) => [cur, cur + 8]);
                setSelectedCards([]);
            } else {
                console.log("Selected Cards do not match");
                setUserScore(([ prev, cur ]) => [cur, cur - 4]);
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

    useEffect(() => {
        const [ prev, cur ] = userScore;
        if (cur > prev) {
            setShowIncreaser(true);
            setTimeout(() => setShowIncreaser(false), 500);
        } else if (cur < prev){
            setShowDecreaser(true);
            setTimeout(() => setShowDecreaser(false), 500);
        };
    }, [userScore])

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
        <div className={styles.gameContainer}>
            <div className={styles.timerBar} ref={timerBar}></div>
            <ExitIcon className={styles.exitIcon} onClick={handleExit} />
            <div className={styles.header}>
                <p className={styles.scoreCounter}>
                    Score: <span className={styles.score}>
                        {userScore[1]}
                        {showIncreaser && <span className={styles.increaseScore}>+8</span>}
                        {showDecreaser && <span className={styles.decreaseScore}>-4</span>}
                    </span>
                </p>
                <LifeBar livesLeft={livesLeft} numberOfLives={config[difficulty].lives} />
            </div>
            <div className={styles.cardsContainer}>
                <div className={styles.flipCardGrid} style={{gridTemplate: config[difficulty].grid.template}}>
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

                        return <FlipCard cardData={cardData} isMatched={isMatched} isFlipped={isFlipped} selectCard={selectCard} setDeckIsDisplayed={i === shuffledCards.length - 1 ? setDeckIsDisplayed : null} i={i} sizes={config[difficulty].grid} key={`flipcard-${i}`}/>;
                    })}
                </div>
            </div>
        </div>
    );
};
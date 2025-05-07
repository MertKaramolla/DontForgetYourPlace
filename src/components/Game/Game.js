import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import FlipCard from "../FlipCard/FlipCard.js";

import { shuffleArray, createDeck } from "../../utilities/deckBuilder.js";

export default function Game() {

    const [ selectedCards, setSelectedCards ] = useState([]);
    const [ matchedCards, setMatchedCards ] = useState([]);

    const { difficulty } = useParams();

    useEffect(() => {
        console.log("selectedCards is set to: ", selectedCards);
        if (selectedCards.length === 2) {
            console.log("2 cards have been selected");
            const isMatch = selectedCards[0].imageId === selectedCards[1].imageId && selectedCards[0].cardType === selectedCards[1].cardType && selectedCards[0].match !== selectedCards[1].match;
            if (isMatch) {
                console.log("match");
                setTimeout(() => {
                    setMatchedCards([...matchedCards, {
                        imageId: selectedCards[0].imageId,
                        cardType: selectedCards[0].cardType
                    }]);
                    setSelectedCards([]);
                }, 1000)
            } else {
                console.log("fail");
                setTimeout(() => setSelectedCards([]), 1000);
            };
        };
    }, [selectedCards]);

    useEffect(() => {
        if (matchedCards.length === cardCount) {
            console.log("Game Over")
        };
    }, [matchedCards]);

    let cardCount = null;

    switch(difficulty) {
        case "easy":
            cardCount = 6;
            break;
        case "medium":
            cardCount = 12;
            break;
        case "hard":
            cardCount = 16;
            break;
        case "insane":
            cardCount = 24;
            break;
        default:
            throw new Error("difficulty is set to unknown value");
    };

    const shuffledCards = useMemo(() => {
        const deck = createDeck(cardCount);
        return shuffleArray(deck);
    }, [cardCount]);

    return (
        <div>
            <p>Game Started at {difficulty}</p>
            <div style={{display: "flex", flexWrap: "wrap"}}>
                {shuffledCards.map((cardData, i) => {
                    return <FlipCard cardData={cardData} selectedCards={selectedCards} setSelectedCards={setSelectedCards} matchedCards={matchedCards} i={i} key={`flipcard-${i}`} />
                })}
            </div>
        </div>
    );
};
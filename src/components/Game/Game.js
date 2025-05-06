import { useState } from "react";
import { useParams } from "react-router-dom";

import FlipCard from "../FlipCard/FlipCard.js";

import { iconManager } from "../../icons/iconManager.js";

export default function Game() {

    const [ selectedCards, setSelectedCards ] = useState(null);
    const { difficulty } = useParams();

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

    function createImageArray(count) {
        let cardArray = [];

        let imageArray = Object.entries(iconManager.image);
        let iconArray = Object.entries(iconManager.cards);

        while (count > 0) {
            let extractIndex = Math.floor(Math.random() * (imageArray.length));
            
            let cardData = imageArray[extractIndex].slice();
            let cardIcon = iconArray[Math.floor(Math.random() * iconArray.length)];

            cardData.push(...cardIcon);
            cardData[0] = {
                imageName: cardData[0],
                imageMatch: "a" 
            };
            let matchingCardData = cardData.slice();
            matchingCardData[0].imageMatch = "b";

            cardArray.push(cardData);
            cardArray.push(matchingCardData);
            imageArray.splice(extractIndex, 1);
            count--;
        };

        return cardArray;
    }

    function shuffleArray(arr) {
        const newArray = arr.slice();
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));

            [ newArray[i], newArray[j] ] = [ newArray[j], newArray[i] ];
        };
        console.log("shuffled array is: ", newArray)
        return newArray;
    };

    const flipCardArray = createImageArray(cardCount);
    const shuffledCards = shuffleArray(flipCardArray);

    return (
        <div>
            <p>Game Started at {difficulty}</p>
            <div>
                {shuffledCards.map((cardData, i) => {
                    return <FlipCard cardData={cardData} selectedCards={selectedCards} setSelectedCards={setSelectedCards} key={`flipcard-${i}`} />
                })}
            </div>
        </div>
    );
};
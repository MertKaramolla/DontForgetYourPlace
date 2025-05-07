import { iconManager } from "../icons/iconManager";

function createDeck(count) {
    let cardArray = [];

    let imageArray = Object.entries(iconManager.image);
    let iconArray = Object.entries(iconManager.cards);

    while (count > 0) {
        let extractIndex = Math.floor(Math.random() * (imageArray.length));
        let cardIcon = iconArray[Math.floor(Math.random() * iconArray.length)];

        let cardData = {
            id: {
                imageId: imageArray[extractIndex][0],
                cardType: cardIcon[0],
                match: "a"
            },
            cardImage: imageArray[extractIndex][1],
            typeImage: cardIcon[1]
        };

        let matchingCardData = {
            ...cardData,
            id: {
                ...cardData.id,
                match: "b"
            }
        };

        cardArray.push(cardData);
        cardArray.push(matchingCardData);
        imageArray.splice(extractIndex, 1);
        count--;
    };

    return cardArray;
};

function shuffleArray(arr) {
    const newArray = arr.slice();
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        [ newArray[i], newArray[j] ] = [ newArray[j], newArray[i] ];
    };
    console.log("shuffled array is: ", newArray)
    return newArray;
};

export { createDeck, shuffleArray };
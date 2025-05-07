##      Left off at

    -> Game.js  -> Add functionality to "GameOver" useState[matchedCards]
                -> Add timer, point counter, and lives
                -> Figure out how to include multiples of same image with different types in insane difficulty

##      Issues to FIX
    -> When FlipCards are flipped they stutter because too much computation is going on (.clip-path costs too much and when a card is flipped all FlipCards rerender due to state change, maybe memoize cards)
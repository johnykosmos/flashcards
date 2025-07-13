import { hasAnimationStarted, storedCards } from "./cardLogic.js";
import { updateMngButtons } from "./tabLogic.js";


export let gameStarted = false;
export let cardsInGame = [];

const gameControlBtn = document.getElementById("gameControlButton");
const mngControlBtn = [
    { button: gameControlBtn, mayInactive: true,
        eventListener: function() {
            const cardInput = document.getElementById("cardInput");
            const guessCounter = document.getElementById("guessCounter");
            if (hasAnimationStarted) {
                return;
            }
            gameStarted = gameStarted ^ true;
            if (gameStarted) {
                cardsInGame = [...storedCards];
                this.style.backgroundColor = "red";
                this.innerText = "⏹";
                cardInput.style.visibility = "visible";
                guessCounter.style.visibility ="visible";
                guessCounter.innerText = `Guessed 0 out of ${storedCards.length}`;
            } else {
                this.style.backgroundColor = "#39FF14";
                this.innerText = "▶";
                cardInput.style.visibility = "hidden";
                cardInput.value = "";
                guessCounter.style.visibility ="hidden";
                guessCounter.innerText = "";
                cardsInGame.length = 0;
            }
        }
    }];


export function finishGame(finish) {
    if (finish) {
        gameControlBtn.click();
    }
}

export function updateGameControl() {
    const inactiveCondition = storedCards.length === 0 ? true : false;
    updateMngButtons(mngControlBtn, inactiveCondition);
}



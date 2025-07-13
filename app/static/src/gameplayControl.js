import { hasAnimationStarted, storedCards } from "./cardLogic.js";
import { updateMngButtons } from "./tabLogic.js";

const gameControlBtn = document.getElementById("gameControlButton");
const mngControlBtn = [
    { button: gameControlBtn, mayInactive: true,
        eventListener: function() {
            const cardInput = document.getElementById("cardInput");
            gameStarted = gameStarted ^ true;
            if (gameStarted && !hasAnimationStarted) {
                this.style.backgroundColor = "red";
                this.innerText = "⏹";
                cardInput.style.visibility = "visible";
            } else {
                this.style.backgroundColor = "#39FF14";
                this.innerText = "▶";
                cardInput.style.visibility = "hidden";
                cardInput.value = "";
            }
        }
    }];

export let gameStarted = false;

export function updateGameControl() {
    const inactiveCondition = storedCards.length === 0 ? true : false;
    updateMngButtons(mngControlBtn, inactiveCondition);
}

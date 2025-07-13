import { storedCards } from "./cardLogic.js";
import { updateMngButtons } from "./tabLogic.js";



export function updateGameControl() {
    const gameControlBtn = document.getElementById("gameControlButton");
    const mngControlBtn = [
        { button: gameControlBtn, mayInactive: true,
    eventListener: () => {}
        }];
    const inactiveCondition = storedCards.length === 0 ? true : false;

    updateMngButtons(mngControlBtn, inactiveCondition);
}

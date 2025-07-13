import { openPopup, PopupType } from "./popupLogic.js";
import { updateMngButtons } from "./tabLogic.js";

export let maxAttempts = 3;

const configTabDOM = document.getElementById("config");

const logoutButton = document.getElementById("logoutButton");

const configMngButtons = [ 
    {button: logoutButton, mayInactive: false, 
        eventListener: function() {openPopup(PopupType.logout);}}
];

export const configTab = {element: configTabDOM, mngButtons: configMngButtons};

function initOptions() {
    const option = document.getElementById("attemptsList");
    const storedAttempts = localStorage.getItem("attempts");
    if (storedAttempts) {
        maxAttempts = Number(storedAttempts)
    }

    option.value = maxAttempts;
    option.addEventListener("input", function() {
        maxAttempts = Number(this.value);
        localStorage.setItem("attempts", this.value);
    });

}

export function configTabInit() {
    initOptions();
    updateMngButtons(configTab.mngButtons);
}

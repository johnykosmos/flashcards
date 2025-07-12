import { openPopup, PopupType } from "./popupLogic.js";
import { updateMngButtons } from "./tabLogic.js";

const configTabDOM = document.getElementById("config");

const logoutButton = document.getElementById("logoutButton");

const configMngButtons = [ 
    {button: logoutButton, mayInactive: false, 
        eventListener: () => openPopup(PopupType.logout)}
];

export const configTab = {element: configTabDOM, mngButtons: configMngButtons};

export function configTabInit() {
    updateMngButtons(configTab.mngButtons);
}

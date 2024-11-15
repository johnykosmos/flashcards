import { loadCardBase, storedCards, popCard } from "./cardLogic.js";
import {openPopup, PopupType} from "./popupLogic.js"
import {updateMngButtons, addToDataTable} from "./tabLogic.js";

const cardbaseTabDOM = document.getElementById("cards");

const addCardbaseButton = document.getElementById("addCardbaseButton");
const removeCardbaseButton = document.getElementById("removeCardbaseButton");
const addCardButton = document.getElementById("addCardButton");

const cardbaseMngButtons = [
    {button: addCardbaseButton, 
        mayInactive: false, eventListener: () => openPopup(PopupType.addCardbase)},
    {button: removeCardbaseButton, 
        mayInactive: true, eventListener: () => openPopup(PopupType.rmCardbase)},
    {button: addCardButton,
        mayInactive: true, eventListener: () => openPopup(PopupType.addCard)}
]

export const cardbaseTab = {element: cardbaseTabDOM,
    mngButtons: cardbaseMngButtons}

export function cardbaseInit(){
    window.speechSynthesis.getVoices();

    const select = cardbaseTab.element.querySelector(".dropdownList");

    const cardbaseName = localStorage.getItem("cardbase"); 
    if(cardbaseName){
        loadCardbaseToTable(cardbaseName);
        select.value = cardbaseName;
    }

    select.addEventListener("input", function(){
        if(!this.value) return;

        const tableBody = cardbaseTab.element.querySelector("tbody"); 
        tableBody.innerHTML = "";

        loadCardbaseToTable(this.value);
        localStorage.setItem("cardbase", this.value);
        updateMngButtons(cardbaseTab.mngButtons);
    });

    updateMngButtons(cardbaseTab.mngButtons); 
}

async function loadCardbaseToTable(cardbaseName){
    const cardsLoaded = await loadCardBase(`/get_cards/${cardbaseName}`);
        if(cardsLoaded){
            storedCards.forEach((card) => addToDataTable(card, `/delete_card/${cardbaseName}/`, () => popCard(card)));        }
}

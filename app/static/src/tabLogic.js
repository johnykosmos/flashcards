import {openPopup, PopupType} from "./popupLogic.js"
import { removeDataRequest } from "./requestHandler.js";

const settingsButton = document.getElementById("settingsButton");
const settingsContainer = document.getElementById("settingsContainer"); 
const closeButton = document.getElementById("closeButton");
const tabContainer = document.getElementById("tabContainer");
const tabContent = document.getElementById("tabContent");
export const tabsContent = tabContent.querySelectorAll(".tab");

export const activeTab = {};


/* --- CARDBASE TAB --- */
const addCardbaseButton = document.getElementById("addCardbaseButton");
const removeCardbaseButton = document.getElementById("removeCardbaseButton");
const addCardButton = document.getElementById("addCardButton");

export const cardbaseMngButtons = [
    {button: addCardbaseButton, 
        mayInactive: false, eventListener: () => openPopup(PopupType.addCardbase)},
    {button: removeCardbaseButton, 
        mayInactive: true, eventListener: () => openPopup(PopupType.rmCardbase)},
    {button: addCardButton,
        mayInactive: true, eventListener: () => openPopup(PopupType.addCard)}
]
/* -/- CARDBASE TAB -/- */


export function handleSettingsSidebar(){
    settingsButton.addEventListener("click", () => {
        settingsContainer.classList.add("open");
        settingsContainer.classList.remove("close");
    }); 
    closeButton.addEventListener("click", () => {
        settingsContainer.classList.add("close");
        settingsContainer.classList.remove("open");
    });   
}

export function tabsInit(){
    const tabs = tabContainer.querySelectorAll(".optionButton");

        tabs.forEach((element, index) => {
            if(element.id !== "closeButton"){
                if(index === 0){
                activeTab.tab = element;
                activeTab.index = index;
                element.classList.add("active");
                tabsContent[index].style.visibility = "visible"; 
            }
            element.addEventListener("click", function(){
                activeTab.tab.classList.remove("active");
                tabsContent[activeTab.index].style.visibility = "hidden";
                activeTab.tab = this;
                activeTab.index = index;
                this.classList.add("active");
                tabsContent[index].style.visibility = "visible"; 
            });
            }
    });
}

export function addToDataTable(data, action){
    const dataTableBody = tabsContent[activeTab.index]
        .querySelector(".dataTable").querySelector("tbody");
    
    const tableRow = document.createElement("tr");
    for(let [key, value] of data){
        const tableCell = document.createElement("td"); 
        tableCell.innerText = value;
        tableRow.appendChild(tableCell); 
    }
    const button = createRemoveButton(action);
    const tableCell = document.createElement("td");
    tableCell.appendChild(button);
    tableRow.appendChild(tableCell);
    dataTableBody.appendChild(tableRow);
}

function removeButtonHandler(event, action){
    const button = event.target;
    const row = button.closest("tr");
    const key = row.querySelector("td").textContent;

    removeDataRequest((action + key), () => row.remove());
}

export function createRemoveButton(action){
    const button = document.createElement("button");
    button.innerText = "X";
    button.classList.add("removeButton");
    button.addEventListener("click", (event) => removeButtonHandler(event, action));

    return button;
}

function removeButtonsInit(action){
    const buttons = tabsContent[activeTab.index].querySelectorAll(".removeButton");

    buttons.forEach((button) => {
        button.addEventListener("click", (event) => removeButtonHandler(event, action));
    }); 

}

export function mngButtonsInit(mngButtons){
    const selectedList =  tabsContent[activeTab.index].querySelector(".dropdownList");
    mngButtons.forEach((element) => {
        if(!selectedList.value && element.mayInactive){
            element.button.classList.add("inactive");
            return;
        }
        element.button.addEventListener("click", element.eventListener);
    });    
}

export function updateMngButtons(mngButtons){
    const selectedList =  tabsContent[activeTab.index].querySelector(".dropdownList");
    if(!selectedList.value){
        mngButtons.forEach((element) => {
            if(element.mayInactive){
                element.button.classList.add("inactive");
                element.button.removeEventListener("click", element.eventListener); 
            }
        });
    }
    else{
        mngButtons.forEach((element) => {
            if(element.mayInactive){
                element.button.classList.remove("inactive");
                element.button.addEventListener("click", element.eventListener); 
            }

        });
    }
}

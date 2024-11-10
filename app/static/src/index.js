import {handleCardLogic, cardsInit, fetchCardBase} from "./cardLogic.js"
import {activeTab, tabsContent, handleSettingsSidebar, tabsInit} from "./tabLogic.js"
import {openPopup, popupInit, PopupType} from "./popupLogic.js"


const addCardbaseButton = document.getElementById("addCardbaseButton");
const removeCardbaseButton = document.getElementById("removeCardbaseButton");


function initMain(){
    tabsInit();
    popupInit();
    handleSettingsSidebar();
    addCardbaseButton.addEventListener("click", () => openPopup(PopupType.addCardbase));
    removeCardbaseButton.addEventListener("click", () => {
        const dropdownList = tabsContent[activeTab.index].querySelector(".dropdownList"); 
        if(dropdownList.value)
            openPopup(PopupType.rmCardbase);
    });    
}

async function main(){
    localStorage.clear();

    await fetchCardBase("/static/cardsTest/test.json");
    
    cardsInit(); 

    console.log(localStorage);

    handleCardLogic(); 
    
    initMain();

}

main();

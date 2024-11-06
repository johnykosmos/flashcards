import {handleCardLogic, cardsInit, fetchCardBase} from "./cardLogic.js"

import {handleSettingsSidebar, tabsInit} from "./tabLogic.js"
import {openPopup, popupInit, PopupType} from "./popupLogic.js"


function initMain(){
    tabsInit();
    popupInit();
    handleSettingsSidebar();
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

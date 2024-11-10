import {handleCardLogic, cardsInit, fetchCardBase} from "./cardLogic.js"
import {handleSettingsSidebar, tabsInit, mngButtonsInit, cardbaseMngButtons} from "./tabLogic.js"
import {popupInit} from "./popupLogic.js"





function initMain(){
    tabsInit();
    mngButtonsInit(cardbaseMngButtons);
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

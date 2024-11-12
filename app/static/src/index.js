import {handleCardLogic, cardsInit, loadCardBase} from "./cardLogic.js"
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

    await loadCardBase("/get_cards/dsada");
    
    cardsInit(); 

    console.log(localStorage);

    handleCardLogic(); 
    
    initMain();

}

main();

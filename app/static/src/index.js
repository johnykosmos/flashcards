import {handleCardLogic, cardsInit} from "./cardLogic.js"
import {handleSettingsSidebar, indexTabs, tabsInit, updateMngButtons} from "./tabLogic.js"
import {popupInit} from "./popupLogic.js"




function initMain(){
    tabsInit();
    updateMngButtons(indexTabs.cardbaseTab.mngButtons);
    popupInit();
    handleSettingsSidebar();
}

async function main(){
    localStorage.clear();

    cardsInit(); 

    console.log(localStorage);

    handleCardLogic(); 
    
    initMain();

}

main();

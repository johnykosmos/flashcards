import {handleCardLogic} from "./cardLogic.js"
import {handleSettingsSidebar, tabsInit, updateMngButtons} from "./tabLogic.js"
import {cardbaseInit} from "./cardbaseTab.js"
import {popupInit} from "./popupLogic.js"


function initMain(){
    tabsInit();
    cardbaseInit();
    popupInit();
    handleSettingsSidebar();
}

async function main(){
    //localStorage.clear();
    console.log(localStorage);

    initMain();

    handleCardLogic(); 
}

main();

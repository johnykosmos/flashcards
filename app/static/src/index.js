import {handleCardLogic} from "./cardLogic.js"
import {handleSettingsSidebar, tabsInit, updateMngButtons} from "./tabLogic.js"
import {cardbaseInit} from "./cardbaseTab.js"
import {popupInit} from "./popupLogic.js"


async function main(){
    console.log(localStorage);
    tabsInit();
    cardbaseInit();
    popupInit();
    handleSettingsSidebar()
    handleCardLogic(); 
}

main();

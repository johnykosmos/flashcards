import {handleCardLogic} from "./cardLogic.js"
import {handleSettingsSidebar, tabsInit} from "./tabLogic.js"
import {cardbaseInit} from "./cardbaseTab.js"
import {popupInit} from "./popupLogic.js"
import {configTabInit } from "./configTab.js";


async function main(){
    console.log(localStorage);
    tabsInit();
    cardbaseInit();
    configTabInit();
    popupInit();
    handleSettingsSidebar()
    handleCardLogic(); 
}

main();

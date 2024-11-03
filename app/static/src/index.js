import {handleCardLogic, cardsInit, fetchCardBase} from "./cardLogic.js"

import {handleSettingsSidebar} from "./settingsLogic.js"


async function main(){
    localStorage.clear();

    await fetchCardBase("/static/cardsTest/test.json");
    
    cardsInit(); 

    console.log(localStorage);

    handleCardLogic(); 

    handleSettingsSidebar();
}

main();

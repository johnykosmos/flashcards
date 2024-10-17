import {handleCardLogic, cardsInit, fetchCardBase} from "./src/cardLogic.js"

import {handleSettingsSidebar} from "./src/settingsBar.js"


async function main(){
    localStorage.clear();

    await fetchCardBase("/static/flashcards/cardsTest/test.json");
    
    cardsInit(); 

    console.log(localStorage);

    handleCardLogic(); 

    handleSettingsSidebar();
}

main();
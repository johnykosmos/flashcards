
import {tabsInit} from "./settingsLogic.js"
import {openPopup, popupInit, PopupType} from "./popupLogic.js"




function main(){
    tabsInit();
    popupInit(); 
    document.getElementById("addButton").addEventListener("click",() =>  openPopup(PopupType.addUser));
}

main();

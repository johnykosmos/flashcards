
import {generateTabs} from "./settingsBar.js"


const adminTabs = [{name: "Users", content: document.createElement('div').appendChild(document.createTextNode('Content for Tab 1')) },
    {name: "CardBases", content: ""}]



function main(){
    generateTabs(adminTabs);   
}

main();

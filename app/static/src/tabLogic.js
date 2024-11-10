import {openPopup, PopupType} from "./popupLogic.js"

const settingsButton = document.getElementById("settingsButton");
const settingsContainer = document.getElementById("settingsContainer"); 
const closeButton = document.getElementById("closeButton");
const tabContainer = document.getElementById("tabContainer");
const tabContent = document.getElementById("tabContent");
export const tabsContent = tabContent.querySelectorAll(".tab");

export const activeTab = {};


/* --- CARDBASE TAB --- */
const addCardbaseButton = document.getElementById("addCardbaseButton");
const removeCardbaseButton = document.getElementById("removeCardbaseButton");

export const cardbaseMngButtons = [
    {button: addCardbaseButton, 
        mayInactive: false, eventListener: () => openPopup(PopupType.addCardbase)},
    {button: removeCardbaseButton, 
        mayInactive: true, eventListener: () => openPopup(PopupType.rmCardbase)}
]
/* -/- CARDBASE TAB -/- */


export function handleSettingsSidebar(){
    settingsButton.addEventListener("click", () => {
        settingsContainer.classList.add("open");
        settingsContainer.classList.remove("close");
    }); 
    closeButton.addEventListener("click", () => {
        settingsContainer.classList.add("close");
        settingsContainer.classList.remove("open");
    });   
}

export function tabsInit(){
    const tabs = tabContainer.querySelectorAll(".optionButton");

        tabs.forEach((element, index) => {
            if(element.id !== "closeButton"){
                if(index === 0){
                activeTab.tab = element;
                activeTab.index = index;
                element.classList.add("active");
                tabsContent[index].style.visibility = "visible"; 
            }
            element.addEventListener("click", function(){
                activeTab.tab.classList.remove("active");
                tabsContent[activeTab.index].style.visibility = "hidden";
                activeTab.tab = this;
                activeTab.index = index;
                this.classList.add("active");
                tabsContent[index].style.visibility = "visible"; 
            });
            }
    });
    
    removeButtonsInit();
}

function removeButtonHandler(event, action){
    const button = event.target;
    const row = button.closest("tr");
    const keyHeader = tabsContent[activeTab.index].querySelector("th").textContent.toLowerCase();

    const header = row.querySelector("td").textContent;
    console.log(keyHeader, header);

    fetch(action, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({[keyHeader]:header}) 
    })
    .then(response => {
        if(!response.ok) 
            throw new Error(`Failed to delete that ${header} entry`)

        row.remove();
    })
    .catch(error => console.error("Error: ", error));

}

function removeButtonsInit(){
    const buttons = tabsContent[activeTab.index].querySelectorAll(".removeButton");
    let action;

    switch(activeTab.index){
        case 0:
            action = "/remove_user"; 
            break;
        case 1:
            action = "/remove_card"; 
            break;
    }
    
    console.log(action);
    
    buttons.forEach((button) => {
        button.addEventListener("click", (event) => removeButtonHandler(event, action));
    }); 

}

export function mngButtonsInit(mngButtons){
    const selectedList =  tabsContent[activeTab.index].querySelector(".dropdownList");
    mngButtons.forEach((element) => {
        if(!selectedList.value && element.mayInactive){
            element.button.classList.add("inactive");
            return;
        }
        element.button.addEventListener("click", element.eventListener);
    });    
}

export function updateMngButtons(mngButtons){
    const selectedList =  tabsContent[activeTab.index].querySelector(".dropdownList");
    if(!selectedList.value){
        mngButtons.forEach((element) => {
            if(element.mayInactive){
                element.button.classList.add("inactive");
                element.button.removeEventListener("click", element.eventListener); 
            }
        });
    }
    else{
        mngButtons.forEach((element) => {
            if(element.mayInactive){
                element.button.classList.remove("inactive");
                element.button.addEventListener("click", element.eventListener); 
            }

        });
    }
}



const settingsButton = document.getElementById("settingsButton");
const settingsContainer = document.getElementById("settingsContainer"); 
const quitButton = document.getElementById("quitSettingsButton");
const tabContainer = document.getElementById("tabContainer");
const tabContent = document.getElementById("tabContent");
export const tabsContent = tabContent.querySelectorAll(".tab");


export const activeTab = {};


export function handleSettingsSidebar(){
    settingsButton.addEventListener("click", () => {
        settingsContainer.classList.add("open");
        settingsContainer.classList.remove("close");
    }); 
    quitButton.addEventListener("click", () => {
        settingsContainer.classList.add("close");
        settingsContainer.classList.remove("open");
    });   
}

export function tabsInit(){
    const tabs = tabContainer.querySelectorAll(".optionButton");

        tabs.forEach((element, index) => {
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


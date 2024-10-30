

const settingsButton = document.getElementById("settingsButton");
const settingsContainer = document.getElementById("settingsContainer"); 
const quitButton = document.getElementById("quitSettingsButton");
const tabContainer = document.getElementById("tabContainer");
const tabContent = document.getElementById("tabContent");


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

export function generateTabs(tabs){
    tabs.forEach((element) => {
        const tab = document.createElement("button");
        tab.textContent = element.name;
        tab.classList.add("optionButton");
        tab.addEventListener("click", function(){
            tabContainer.querySelectorAll(".optionButton").forEach((btn) => {
               btn.classList.remove("active"); 
            });
            this.classList.add("active");
            tabContent.innerHTML = "";
            tabContent.appendChild(element.content);
        });
        tabContainer.appendChild(tab);
    });       
}


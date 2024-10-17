

const settingsButton = document.getElementById("settingsButton");
const settingsContainer = document.getElementById("settingsContainer"); 
const quitButton = document.getElementById("quitSettingsButton");


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

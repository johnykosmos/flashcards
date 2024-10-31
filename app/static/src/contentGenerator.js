

const settingsButton = document.getElementById("settingsButton");
const settingsContainer = document.getElementById("settingsContainer"); 
const quitButton = document.getElementById("quitSettingsButton");
const tabContainer = document.getElementById("tabContainer");
const tabContent = document.getElementById("tabContent");


const activeTab = {};


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
    const tabsContent = tabContent.querySelectorAll(".tab");
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
}



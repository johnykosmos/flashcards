
const popup = document.getElementById("popup");
const popupForm = popup.querySelector(".popupForm");
const popupContent = popup.querySelector(".popupContent");

export const PopupType = {
    addUser: buildAddUserPopup 
}

let lastPopupType;


export function openPopup(popupType){
    if(lastPopupType !== popupType){
        popupContent.innerHTML = "";
        lastPopupType = popupType;
        popupType();
        console.log("dupa");
    }
    popup.classList.remove("hide")
    popup.classList.add("show");
}

export function popupInit(){
    popup.querySelector(".quitButton").addEventListener("click", () => {
        popup.classList.add("hide");
        popup.classList.remove("show");
    });
}

function createInput(placeholder, name){
    const input = document.createElement("input");
    
    input.type = "text";
    input.autocomplete = "off";
    input.classList.add("popupInput");
    input.placeholder = placeholder;
    input.name = name;

    return input;
}

function buildAddUserPopup(){
    const login = createInput("Login", "login");
    const password = createInput("Password", "password");
    
    popupForm.action = "/add_user";

}

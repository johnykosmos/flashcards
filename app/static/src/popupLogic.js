
import {activeTab, tabsContent} from "./settingsLogic.js"


const popup = document.getElementById("popup");
const popupForm = popup.querySelector(".popupForm");
const popupContent = popup.querySelector(".popupContent");
const submitButton = popup.querySelector(".submitButton");

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

function addToDataTable(formData){
    const dataTableBody = tabsContent[activeTab.index]
        .querySelector(".dataTable").querySelector("tbody");
    
    const tableRow = document.createElement("tr");
    for(let [key, value] of formData.entries()){
        const tableCell = document.createElement("td"); 
        tableCell.innerText = value;
        tableRow.appendChild(tableCell); 
    }

    dataTableBody.appendChild(tableRow);
}

function submitButtonHandler(callback){
    popupForm.addEventListener("submit", function(event){
        event.preventDefault();
        const formData = new FormData(popupForm);

        fetch(popupForm.action, {
            method: popupForm.method,
            body: formData
        })
        .then(response => {
            if(!response.ok)
                throw new Error("Network response was not ok");
            else if(response.status === 201){
                callback(formData); 
            }
            return response.json();
        })
        .then(data => {
            alert(data.msg);
        })
        .catch(error => {
            alert(error.message);
        });

    });
}

function buildAddUserPopup(){
    popupForm.action = "/add_user";
    
    const inputDiv = document.createElement("div");
    inputDiv.classList.add("inputPair");

    const login = createInput("Login", "login");
    const password = createInput("Password", "password");

    inputDiv.appendChild(login);
    inputDiv.appendChild(password);
    
    popupContent.appendChild(inputDiv);

    submitButtonHandler(addToDataTable);
}

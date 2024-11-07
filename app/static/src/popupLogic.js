
import {activeTab, tabsContent} from "./tabLogic.js"


const popup = document.getElementById("popup");
const popupForm = popup.querySelector(".popupForm");
const popupContent = popup.querySelector(".popupContent");
const submitButton = popup.querySelector(".submitButton");

export const PopupType = {
    addCardbase: buildCreateCardbasePopup 
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

function checkFormValues(){
    const formValues = popup.querySelectorAll("input, select");

    for(let element of formValues){ 
        if(!element.value)
            return 0;
    }
    return 1;
}

function createInput(placeholder, height, width){
    const input = document.createElement("input");
    
    input.type = "text";
    input.autocomplete = "off";
    input.classList.add("popupInput");
    input.placeholder = placeholder;
    input.name = placeholder.toLowerCase();
    input.style.width = `${width}vh`;
    input.style.height = `${height}vh`;

    return input;
}

function createSelect(name, height, width){
    const select = document.createElement("select");

    select.classList.add("popupSelect");
    select.name = name;
    select.style.width = `${width}vh`;
    select.style.height = `${height}vh`;
    
    return select;
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
        if(!checkFormValues()){
            alert("Form is not fulfilled");
            return;
        }

        const formData = new FormData(popupForm);

        fetch(popupForm.action, {
            method: popupForm.method,
            body: formData
        })
        .then(response => {
            if(!response.ok)
                throw new Error(`Error ${response.status}: ${response.statusText}`);
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

function buildCreateCardbasePopup(){
    popupForm.action = "/create_cardbase";

    const selectDiv = document.createElement("div");
    selectDiv.classList.add("selectPair");

    const inputDiv = document.createElement("div");

    const lang1 = createSelect("lang1", 5, 14);
    const lang2 = createSelect("lang2", 5, 14);
    const cbName = createInput("Name", 5, 25);

    selectDiv.appendChild(lang1);
    selectDiv.appendChild(lang2);
    inputDiv.appendChild(cbName);
    
    popupContent.appendChild(selectDiv);
    popupContent.appendChild(inputDiv);

    submitButton.innerText = "Create";

    submitButtonHandler(addToDataTable);
}

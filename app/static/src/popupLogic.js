
import { postRequest, deleteRequest } from "./requestHandler.js";
import {activeTab, tabsContent} from "./tabLogic.js"


const popup = document.getElementById("popup");
const popupForm = popup.querySelector(".popupForm");
const popupContent = popup.querySelector(".popupContent");
const submitButton = popup.querySelector(".submitButton");
const quitButton = popup.querySelector(".quitButton");


export const PopupType = {
    addCardbase: buildCreateCardbasePopup,
    rmCardbase: buildRemoveCardbasePopup
}

let lastPopupType;
let lastSubmitHandler;


export function openPopup(popupType){
    if(lastPopupType !== popupType){
        popupContent.innerHTML = "";
        lastPopupType = popupType;
        popupType();
    }
    popup.classList.remove("hide")
    popup.classList.add("show");
}

export function popupInit(){
    quitButton.addEventListener("click", () => {
        popup.classList.add("hide");
        popup.classList.remove("show");
    });
}

async function getData(action){
    return fetch(action)
    .then(response => {
        if(!response.ok)
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        return response.json();
    })
    .then(data => {return data;})
    .catch(error => {
        console.error(error);
        return null;
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

function createSelect(name, data, height, width){
    const select = document.createElement("select");

    select.classList.add("popupSelect");
    select.name = name;
    select.style.width = `${width}vh`;
    select.style.height = `${height}vh`;

    data.forEach((element) => {
        const option = document.createElement("option");
        option.value = element.value;
        option.innerText = element.name;
        select.appendChild(option); 
    });
    
    return select;
}

function addToSelect(formData){
    const select = tabsContent[activeTab.index].querySelector(".dropdownList");
    const option = document.createElement("option");
    const name = formData.get("name");

    option.value = name;
    option.innerText = name;
    select.appendChild(option);

    select.value = name;
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

function submitButtonHandler(request, callback, exit=false){
    if(lastSubmitHandler)
        popupForm.removeEventListener("submit", lastSubmitHandler);

    lastSubmitHandler = function(event){
        event.preventDefault();
        if(!checkFormValues()){
            alert("Form is not fulfilled");
            return;
        }

       if(request(popupForm, callback)){
            const inputs = popupContent.querySelectorAll("select, input"); 
            inputs.forEach((input) => {
                input.value = "";
            });
            if(exit) quitButton.click(); 
        } 
    }
    popupForm.addEventListener("submit", lastSubmitHandler);
}

async function buildCreateCardbasePopup(){
    popupForm.action = "/create_cardbase";
    popupForm.method = "POST";

    const selectDiv = document.createElement("div");
    selectDiv.classList.add("selectPair");

    const inputDiv = document.createElement("div");

    const languages = await getData("/get_language");

    const lang1 = createSelect("lang1", languages, 5, 14);
    const lang2 = createSelect("lang2", languages, 5, 14);
    const cbName = createInput("Name", 5, 25);

    selectDiv.appendChild(lang1);
    selectDiv.appendChild(lang2);
    inputDiv.appendChild(cbName);
    
    popupContent.appendChild(selectDiv);
    popupContent.appendChild(inputDiv);
    submitButton.innerText = "Create";

    submitButtonHandler(postRequest, addToSelect, true);
}

function buildRemoveCardbasePopup(){
    const selectedCardbase = tabsContent[activeTab.index].querySelector(".dropdownList"); 
    if(!selectedCardbase.value){
        return;
    }

    popupForm.action = `/delete_cardbase/${selectedCardbase.value}`;
    popupForm.method = "DELETE";

    const text = document.createElement("div");
    text.classList.add("popupText");
    text.innerText = `Are you sure you want to delete "${selectedCardbase.value}" cardbase?`;

    submitButton.innerText = "Yes";

    popupContent.appendChild(text);

    const removeFromSelect = function(){
        selectedCardbase.remove(selectedCardbase.selectedIndex); 
        lastPopupType = null;
    }

    submitButtonHandler(deleteRequest, removeFromSelect, true);
}


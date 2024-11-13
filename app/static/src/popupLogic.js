
import { formPostRequest, formDeleteRequest, getDataRequest } from "./requestHandler.js";
import {updateMngButtons, addToDataTable, indexTabs} from "./tabLogic.js"


const popup = document.getElementById("popup");
const popupForm = popup.querySelector(".popupForm");
const popupContent = popup.querySelector(".popupContent");
const submitButton = popup.querySelector(".submitButton");
const quitButton = popup.querySelector(".quitButton");


export const PopupType = {
    addCardbase: buildCreateCardbasePopup,
    rmCardbase: buildRemoveCardbasePopup,
    addCard: buildAddCardPopup
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

function addToSelect(formData, tab){
    const select = tab.querySelector(".dropdownList");
    const option = document.createElement("option");
    const name = formData.get("name");

    option.value = name;
    option.innerText = name;
    select.appendChild(option);

    select.value = name;
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

    const selectDiv = document.createElement("div");
    selectDiv.classList.add("selectPair");

    const inputDiv = document.createElement("div");

    const languages = await getDataRequest("/get_language");

    const lang1 = createSelect("lang1", languages, 5, 14);
    const lang2 = createSelect("lang2", languages, 5, 14);
    const cbName = createInput("Name", 5, 25);

    selectDiv.appendChild(lang1);
    selectDiv.appendChild(lang2);
    inputDiv.appendChild(cbName);
    
    popupContent.appendChild(selectDiv);
    popupContent.appendChild(inputDiv);
    submitButton.innerText = "Create";

    submitButtonHandler(formPostRequest, function(formData){
        addToSelect(formData, indexTabs.cardbaseTab.element);
        updateMngButtons(indexTabs.cardbaseTab.mngButtons);
    }, true);
}

function buildRemoveCardbasePopup(){
    const selectedCardbase = indexTabs.cardbaseTab.element.querySelector(".dropdownList"); 

    popupForm.action = `/delete_cardbase/${selectedCardbase.value}`;

    const text = document.createElement("div");
    text.classList.add("popupText");
    text.innerText = `Are you sure you want to delete "${selectedCardbase.value}" cardbase?`;

    submitButton.innerText = "Yes";

    popupContent.appendChild(text);

    const removeFromSelect = function(){
        selectedCardbase.remove(selectedCardbase.selectedIndex); 
        lastPopupType = null;
        updateMngButtons(indexTabs.cardbaseTab.mngButtons);
    }

    submitButtonHandler(formDeleteRequest, removeFromSelect, true);
}

function buildAddCardPopup(){
    const selectedCardbase = indexTabs.cardbaseTab.element.querySelector(".dropdownList"); 
    popupForm.action = `/add_card/${selectedCardbase.value}`;

    const text = document.createElement("div");
    text.classList.add("popupText");
    text.innerText = "Please, type in the word and it's translation";

    const inputDiv = document.createElement("div"); 
    inputDiv.classList.add("inputPair");    

    popupContent.appendChild(text);

    const key = createInput("Key", 5, 12);
    const translation = createInput("Translation", 5, 12);
    
    inputDiv.appendChild(key);
    inputDiv.appendChild(translation);

    popupContent.appendChild(inputDiv); 

    submitButton.innerText = "Add";

    submitButtonHandler(formPostRequest, (data) => {
        addToDataTable(data.entries(), `/delete_card/${selectedCardbase.value}/`);
    }, false);
}

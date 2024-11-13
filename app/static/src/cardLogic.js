import { getDataRequest } from "./requestHandler.js";

const frontCard = document.getElementById("cardFront");
const backCard = document.getElementById("cardBack");
const frontWord = document.getElementById("frontWord");
const backWord = document.getElementById("backWord");
const cardInput = document.getElementById("cardInput");
const showNext = document.getElementById("showNext");

export let storedCards = [];
let langInfo;
let lastKey = 0;
let mistakeCounter = 0;
let hasAnimationStarted = false;


function setLocalConfig(data){
    langInfo = data.langInfo;
    storedCards = data.cards;

    const key = getCardKey();
    console.log(storedCards);
    frontWord.innerText = storedCards[key].key;
    backWord.innerText = storedCards[key].translation;
}

export async function loadCardBase(action){
    const data = await getDataRequest(action);
    if(data && data.cards.length !== 0) 
        setLocalConfig(data);      
}

function animateCard(animation, time){
    frontCard.classList.add(animation); 
    hasAnimationStarted = true;
    setTimeout(function(){
        hasAnimationStarted = false;
        frontCard.classList.remove(animation);
    }, time);
}

function startCardFlip(newFrontWord, newBackWord){
    frontCard.classList.remove("flipFrontLeft");
    backCard.classList.remove("flipBackLeft");
    frontCard.classList.add("flipFrontRight");
    backCard.classList.add("flipBackRight");

    setTimeout(() => {
        frontWord.innerText = newFrontWord;
    }, 2000);

    showNext.classList.add("visible");
    showNext.addEventListener("click", () => flipCardLeft(newBackWord));
}

function flipCardLeft(newBackWord){
    showNext.removeEventListener("click", () => flipCardLeft(newBackWord));
    showNext.classList.remove("visible");
    backCard.classList.add("flipBackLeft");    
    animateCard("flipFrontLeft", 3000);
    frontCard.classList.remove("flipFrontRight");
    backCard.classList.remove("flipBackRight");

    setTimeout(() => {
        cardInput.value = '';
        cardInput.disabled = false;
        cardInput.focus();
        backWord.innerText = newBackWord;
    }, 2000);

}

function getCardKey(){
    let key;
    do{
        key = Math.floor(Math.random() * storedCards.length);
    }while(key === lastKey);

    lastKey = key;

    return key;
}

export async function cardsInit(){
    const cardbaseName = localStorage.getItem("cardbase"); 
    if(cardbaseName){
        const action = "/get_cards/" + cardbaseName; 
        await loadCardBase(action)
    }
}

function getNextCard(){
    const key = getCardKey();
    const newWord = storedCards[key].key;
    const newTranslation = storedCards[key].translation;
    hasAnimationStarted = true;
    cardInput.blur();
    cardInput.disabled = true;

    if(Math.floor(Math.random() * 2) === 0)
        startCardFlip(newWord, newTranslation);
    else
        startCardFlip(newTranslation, newWord);
}

export function handleCardLogic(){
    cardInput.addEventListener("keydown", (event) => {
        if(storedCards.length !== 0 && 
            event.key === "Enter" && !hasAnimationStarted){
            if(backWord.innerText === cardInput.value){
                animateCard("goodAnswer", 1000); 
                setTimeout(() => getNextCard(), 1000);
            }
            else{
                animateCard("badAnswer", 800);
                mistakeCounter++;
                if(mistakeCounter === 3){
                    mistakeCounter = 0;
                    setTimeout(() => getNextCard(), 800);
                }
            }

        }
    });
}

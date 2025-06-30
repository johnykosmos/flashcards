import { getDataRequest } from "./requestHandler.js";
import { settingsButton } from "./tabLogic.js";

const frontCard = document.getElementById("cardFront");
const backCard = document.getElementById("cardBack");
const frontWord = document.getElementById("frontWord");
const backWord = document.getElementById("backWord");
const cardInput = document.getElementById("cardInput");
const showNext = document.getElementById("showNext");

const synth = window.speechSynthesis;
const langInfo = {};

export let storedCards = [];
let currentLangOrder = [];
let lastKey = -1; // offset to draw the first card for sure
let lastPlayedLang;
let mistakeCounter = 0;
let hasAnimationStarted = false;
let voicesLoaded = false;


function speakText(text, language){
    synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    if(language !== lastPlayedLang){
        const voices = synth.getVoices();
        const selectedVoice = voices.find(voice => voice.lang === language);
        utterance.voice = selectedVoice;
    }
    utterance.lang = language;
    synth.speak(utterance);
}

function handleTTSButtons(){
    const card = [frontCard, backCard];
    card.forEach((side, index) => {
        const ttsButton = side.querySelector(".ttsButton"); 
        ttsButton.addEventListener("click", () =>{ 
            speakText(side.innerText, currentLangOrder[index])
        });
    });
}

function setLangOrder(front, back){
    currentLangOrder[0] = front;
    currentLangOrder[1] = back;
}

function setLocalConfig(data){
    langInfo.key = data.langInfo.key;
    langInfo.translation = data.langInfo.translation;
    if(data.cards.length !== 0){
        storedCards = data.cards;
        lastKey = -1;
        setCards();    
    }
}

export function setCards(){
    const key = getCardKey();
    if(Math.floor(Math.random() * 2) === 0){
        frontWord.innerText = storedCards[key].key;
        backWord.innerText = storedCards[key].translation;
        setLangOrder(langInfo.key, langInfo.translation);
    }
    else{
        frontWord.innerText = storedCards[key].translation;
        backWord.innerText = storedCards[key].key;
        setLangOrder(langInfo.translation, langInfo.key);
    }
}

export function popCard(card){
    const index = storedCards.indexOf(card);
    if (index > -1) 
        storedCards.splice(index, 1);

    if(storedCards.length === 0){
        frontWord.innerText = "";
        backWord.innerText = "";
    }
}

export async function loadCardBase(action){
    const data = await getDataRequest(action);
    if(data.data){ 
        setLocalConfig(data.data);      
        return true;
    }
    storedCards = [];
    frontWord.innerText = "";
    backWord.innerText = "";
    return false;
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
        settingsButton.disabled = false;
        cardInput.focus();
        backWord.innerText = newBackWord;
    }, 2000);

}

function getCardKey(){
    let key;
    do{
        key = Math.floor(Math.random() * storedCards.length);
    }while(key === lastKey);

    if(storedCards.length > 1)
        lastKey = key;

    return key;
}

function getNextCard(){
    const key = getCardKey();
    const newWord = storedCards[key].key;
    const newTranslation = storedCards[key].translation;
    hasAnimationStarted = true;
    cardInput.blur();
    cardInput.disabled = true;
    settingsButton.disabled = true;

    if(Math.floor(Math.random() * 2) === 0){
        startCardFlip(newWord, newTranslation);
        setLangOrder(langInfo.key, langInfo.translation);
    }
    else{
        startCardFlip(newTranslation, newWord);
        setLangOrder(langInfo.translation, langInfo.key);
    }
}

export function handleCardLogic(){
    handleTTSButtons();

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

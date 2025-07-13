import { getDataRequest } from "./requestHandler.js";
import { settingsButton } from "./tabLogic.js";
import { maxAttempts } from "./configTab.js";
import { cardsInGame, finishGame, gameStarted } from "./gameplayControl.js";


const frontCard = document.getElementById("cardFront");
const backCard = document.getElementById("cardBack");
const frontWord = document.getElementById("frontWord");
const backWord = document.getElementById("backWord");
const cardInput = document.getElementById("cardInput");
const showNext = document.getElementById("showNext");
const guessCounter = document.getElementById("guessCounter");

const synth = window.speechSynthesis;
const langInfo = {};

export let storedCards = [];
let currentLangOrder = [];
let nextBackWord = "";
let lastKey = -1; // offset to draw the first card for sure
let mistakeCounter = 0;
let currentCard = null;
export let hasAnimationStarted = false;
let loadedVoices = [];


function loadVoices() {
    for (let i = 0; i < currentLangOrder.length; i++) {
        const voices = synth.getVoices();
        const selectedVoice = voices.find(voice => voice.lang === currentLangOrder[i]);
        loadedVoices[i] = selectedVoice;
    }
}

function speakText(index, text, language){
    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = loadedVoices[index];
    utterance.lang = language;
    synth.speak(utterance);
}

function handleTTSButtons(){
    const card = [frontCard, backCard];
    card.forEach((side, index) => {
        const ttsButton = side.querySelector(".ttsButton"); 
        ttsButton.addEventListener("click", () =>{ 
            speakText(index, side.innerText, currentLangOrder[index])
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
        return true;
    } 
    return false;
}

export function setCards(){
    const key = getCardKey(storedCards);
    currentCard = storedCards[key];
    if(Math.floor(Math.random() * 2) === 0){
        frontWord.innerText = currentCard.key;
        backWord.innerText = currentCard.translation;
        setLangOrder(langInfo.key, langInfo.translation);
    }
    else{
        frontWord.innerText = currentCard.translation;
        backWord.innerText = currentCard.key;
        setLangOrder(langInfo.translation, langInfo.key);
    }
    
    loadVoices();
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
    if(data.data && setLocalConfig(data.data)){ 
        return true;
    } 
    storedCards.length = 0;
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
    nextBackWord = newBackWord;
}

function flipCardLeft(newBackWord){
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

function getCardKey(cardStorage){
    let key;
    do {
        key = Math.floor(Math.random() * cardStorage.length);
    } while(key === lastKey);

    lastKey = key;
    return key;
}

function getNextCard(){
    const key = cardsInGame.length !== 1 ? getCardKey(cardsInGame) : 0;
    currentCard = cardsInGame[key];
    const newWord = currentCard.key;
    const newTranslation = currentCard.translation;
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

    showNext.addEventListener("click", () => flipCardLeft(nextBackWord));

    cardInput.addEventListener("keydown", (event) => {
        if(gameStarted && 
            event.key === "Enter" && !hasAnimationStarted){
            if(backWord.innerText === cardInput.value){
                animateCard("goodAnswer", 1000); 
                cardsInGame.splice(cardsInGame.indexOf(currentCard), 1);
                const cardsPassed = storedCards.length - cardsInGame.length; 
                const guessedCards = `Guessed ${cardsPassed} out of ${storedCards.length}`;
                guessCounter.innerText = guessedCards;
                if (cardsPassed === storedCards.length) {
                    hasAnimationStarted = false;
                    finishGame(true);
                    return;
                }
                setTimeout(() => getNextCard(), 1000);
            }
            else{
                animateCard("badAnswer", 800);
                mistakeCounter++;
                if(mistakeCounter === maxAttempts){
                    mistakeCounter = 0;
                    setTimeout(() => getNextCard(), 800);
                }
            }

        }
    });
}

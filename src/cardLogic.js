export const frontCard = document.getElementById("cardFront");
export const backCard = document.getElementById("cardBack");
const frontWord = document.getElementById("frontWord");
export const backWord = document.getElementById("backWord");
export const cardInput = document.getElementById("cardInput");
const showNext = document.getElementById("showNext");

export let hasAnimationStarted = false;
let storedCards = [];
let lastKey = 0;

function setLocalConfig(data){
    localStorage.setItem("langInfo", JSON.stringify(data.lang));
    localStorage.setItem("cards", JSON.stringify(data.cards));
}

export async function fetchCardBase(cardBaseName){
    try{
        const response = await fetch(cardBaseName);
        const data = await response.json();
        setLocalConfig(data);      
    }
    catch(error){
        console.error("Couldn't fetch the card base! ", error);
    }
}

function getCardKey(){
    let key;
    do{
        key = Math.floor(Math.random() * storedCards.length);
    }while(key === lastKey);

    lastKey = key;

    return key;
}

export function cardsInit(){
    storedCards = JSON.parse(localStorage.getItem("cards"));
    const key = getCardKey();
    console.log(storedCards[key][0]);
    frontWord.innerText = storedCards[key][0];
    backWord.innerText = storedCards[key][1];
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

export function animateCard(animation, time){
    frontCard.classList.add(animation); 
        hasAnimationStarted = true;
        setTimeout(function(){
            hasAnimationStarted = false;
            frontCard.classList.remove(animation);
        }, time);
}


export function getNextCard(){
    const key = getCardKey();
    const newWord = storedCards[key][0];
    const newTranslation = storedCards[key][1];
    hasAnimationStarted = true;
    cardInput.blur();
    cardInput.disabled = true;

    if(Math.floor(Math.random() * 2) === 0)
        startCardFlip(newWord, newTranslation);
    else
        startCardFlip(newTranslation, newWord);


}

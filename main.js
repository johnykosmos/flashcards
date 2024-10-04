import {frontCard, backWord, hasAnimationStarted, animateCard, 
    fetchCardBase, cardsInit,
    getNextCard} from "./src/cardLogic.js"




let counter = 0;
let mistakeCounter = 0;

async function main(){
    localStorage.clear();

    await fetchCardBase("./cardsTest/test.json");
    
    cardsInit(); 

    console.log(localStorage);

    cardInput.addEventListener("keydown", (event) => {
        if(event.key === "Enter" && !hasAnimationStarted){
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

main();

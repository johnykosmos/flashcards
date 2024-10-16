

export let hasAnimationStarted = false;


export function simpleAnimation(domObj, animation, time){
    domObj.classList.add(animation); 
    hasAnimationStarted = true;
    setTimeout(function(){
        hasAnimationStarted = false;
        domObj.classList.remove(animation);
    }, time);
}

export function setAnimationStart(boolValue){
    hasAnimationStarted = boolValue;
}

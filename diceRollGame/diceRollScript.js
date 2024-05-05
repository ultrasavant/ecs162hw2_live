// Premise for dice roll:
// click dice to roll,
// get random value
// update picture of dice and text
// real time display of seconds until redirection, redirect to another game

// Event handler to detect click
let diceClicked = false;
let startRedirection = false;
// let redirectionNumber = 0;

// Load page, then add click detect for dice
document.addEventListener('DOMContentLoaded', () => {
    const icon = document.querySelector('.gameIcon');
    icon.addEventListener('click', handleDiceRoll);
});

// Respond to click
function handleDiceRoll() {
    if (diceClicked == true) {
        return
    } 
    diceClicked = true
    
    // Get random value of dice, 1-6 inclusive
    let rolledValue = Math.floor(Math.random() * 6) + 1;

    updateDiceImage(rolledValue);
    if (rolledValue >= 3) {
        diceClicked = false;
        return
    }

}

function updateDiceImage(rolledValue) {
    // Retrieve dice image from folder and put onto div
    let diceValueURL = `../img/dice${rolledValue}.png`;
    let dicePicture = document.querySelector('.gameIcon img');
    dicePicture.src = diceValueURL;

    // Update dice descriptions
    let diceName = document.querySelector('.gameName');
    let diceDescription = document.querySelector('.gameDescription');
    diceName.innerHTML = `You rolled a ${rolledValue}.`;

    // Dice values less than 3 will redirect user to new game
    if (rolledValue < 3) {
        let secondsLeft = 5;
        diceDescription.innerHTML = `Redirection to game ${rolledValue} in ${secondsLeft} seconds.`;
        const intervalId = setInterval(function () {
            secondsLeft -= 1;
            diceDescription.innerHTML = `Redirection to game ${rolledValue} in ${secondsLeft} seconds.`;

            if (secondsLeft === 0) {
                clearInterval(intervalId);

                // Update status with redirection
                handleRedirection(rolledValue);
            }
        }, 1000);
    }
    else {
        diceDescription.innerHTML = 'Click to reroll.' 
    }

}

function handleRedirection(rolledValue) {
    let redirectionHref;
    // Each dice value leads to different redirection site
    switch (rolledValue) {
        case 1:
            redirectionHref = `../cardMatchGame/cardMatch.html`;
            break;
        case 2:
            redirectionHref = `../albumQuizGame/albumQuiz.html`;
            break;
        default:
            redirectionHref = '../index.html';

    }
    // Retrieved redirection url, redirect now
    window.location.href = redirectionHref;

}
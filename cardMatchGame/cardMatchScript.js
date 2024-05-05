// Premise: Pairs of cards loaded with numbers 1-4 randomly
let gameState = ["", "", "", "", "", "", "", ""];
// Loaded gameState indices, already assigned random album number
let loadedIndices = [];

let showingCardNumbers = ["", ""];
let showingAlbumNumbers = ["", ""];


document.addEventListener('DOMContentLoaded', () => {
    // Randomizes numbers 1-4 and assign value as gameState element
    randomizeCards();
    // console.log("game state: ", gameState.toString());

    // Detect clicks for card and restart button
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => card.addEventListener('click', handleCheckCard));

    const restartButtons = document.querySelectorAll('.restartButton')
    restartButtons.forEach(restartButton => restartButton.addEventListener('click', restartGame)); 
});

function restartGame() {
    // Reset cards visually
    const cards = document.querySelectorAll('.card');

    cards.forEach(function(card) {
        card.style.display = "";
        card.style.border = '2px solid black';
        card.style.backgroundImage = `url()`;
    });

    // Clear status message
    overlapMessage = document.querySelector('.overlapMessage');
    overlapMessage.innerHTML = "";

    // Clear win message if present
    const winContainer = document.querySelector('.winContainer');
    winContainer.style.display = "none";

    // Reset internals
    gameState = ["", "", "", "", "", "", "", "", ""];
    loadedIndices = [];

    // Randomize for new game
    randomizeCards();

    // Allow show card after randomizing
    showingCardNumbers = ["", ""];
    showingAlbumNumbers = ["", ""];

    
}

function randomizeCards() {
    for (let albumNum = 1; albumNum < 5; albumNum += 1) {
        for (i = 0; i < 2; i += 1) {
            let randomIndex = getRandomIndex(loadedIndices);
            // Record album number into gameState random index
            gameState[randomIndex] = albumNum;
            loadedIndices.push(randomIndex);
        }
    }
}

// Retrieves a random available index given loadedIndices
function getRandomIndex(loadedIndices) {
    while (true) {
        // Get random index value, 0-7 inclusive
        let randomAvailableIndex = Math.floor(Math.random() * 8);
        if (loadedIndices.includes(randomAvailableIndex)) {
            continue
        }
        // Found available index
        return randomAvailableIndex
    }
}

function handleCheckCard(clickedCardEvent) {
    // Player clicked on card, show result if less than two face up
    if (!showingCardNumbers.includes("")) {
        // Two cards already faced up
        return
    }
    // Show card based on album number
    let [clickedCardNumber, clickedAlbumNumber] = showCardAlbum(clickedCardEvent);

    // Update number of cards facing up
    if (showingCardNumbers[0] == "") {
        // Only one card facing up
        showingCardNumbers[0] = clickedCardNumber;
        showingAlbumNumbers[0] = clickedAlbumNumber
        return;
    } 
    // Two cards facing up
    showingCardNumbers[1] = clickedCardNumber;
    showingAlbumNumbers[1] = clickedAlbumNumber;
    let isMatch = checkForMatch(showingAlbumNumbers);

    // Showed both cards to player, update match status on screen
    updateStatus(isMatch, showingCardNumbers);


}

// Shows album picture on card, returns card number and album number shown
function showCardAlbum(clickedCardEvent) {
    const clickedCard = clickedCardEvent.target;
    const clickedCardNumber = parseInt(clickedCard.getAttribute('cardNumber'));
    const clickedAlbumNumber = gameState[clickedCardNumber - 1];
    const albumName = `s${clickedAlbumNumber}Album.webp`;

    clickedCard.style.backgroundImage = `url(../img/${albumName})`;
    // console.log("clicked album number is ", clickedAlbumNumber);
    // console.log("clickedCardNumber returned is ", clickedCardNumber);
    return [clickedCardNumber, clickedAlbumNumber];
}

function checkForMatch(showingAlbumNumbers) {
    // Compare albums of faced up cards
    if (showingAlbumNumbers[0] == showingAlbumNumbers[1]) {
        return true;
    }
    return false;
}

function updateStatus(isMatch, showingCardNumbers) {
    // console.log("calling updateMatchStatus, it has values of ", showingCardNumbers.toString())
    const firstCard = document.querySelector(`button[cardNumber="${showingCardNumbers[0]}"]`);
    const secondCard = document.querySelector(`button[cardNumber="${showingCardNumbers[1]}"]`);

    if (!isMatch) {
        updateNoMatchStatus(firstCard, secondCard);
    }
    else {
        updateMatchStatus(firstCard, secondCard);
    }
    
}

function updateNoMatchStatus(firstCard, secondCard) {
    // Hightlight perimeter of cards chosen
    firstCard.style.border = '2px solid red';
    secondCard.style.border = '2px solid red';

    overlapMessage = document.querySelector('.overlapMessage');
    overlapMessage.style.color = 'red';
    overlapMessage.innerHTML = "No Match";

    setTimeout(function() {
        // Reset effects after showing status
        firstCard.style.border = '2px solid black';
        secondCard.style.border = '2px solid black';
        firstCard.style.backgroundImage = `url()`;
        secondCard.style.backgroundImage = `url()`;
        overlapMessage.innerHTML = "";

        // Reset internals
        showingCardNumbers = ["", ""];
        showingAlbumNumbers = ["", ""];
    }, 2000);

}

function updateMatchStatus(firstCard, secondCard) {
    firstCard.style.border = '2px solid green';
    secondCard.style.border = '2px solid green';

    overlapMessage = document.querySelector('.overlapMessage');
    overlapMessage.style.color = 'green';
    overlapMessage.innerHTML = "Match!";

    setTimeout(function() {
        firstCard.style.display = "none";
        secondCard.style.display = "none";
        overlapMessage.innerHTML = "";

        // Reset internals
        showingCardNumbers = ["", ""];
        showingAlbumNumbers = ["", ""];

        // Check win status
        checkWinStatus()
    }, 2000);


}

function checkWinStatus() {
    // Initialize flag to keep track
    let allCardsMatched = true;
    const cards = document.querySelectorAll('.card');
    cards.forEach(function(card) {
        let isDone = card.style.display == "none"
        if (!isDone) {
            // Didn't match all cards yet
            // console.log("didn't finish for win")
            allCardsMatched = false
            return
        }
    });

    if (!allCardsMatched) {return}

    showWinScreen();
}

function showWinScreen() {
    const winContainer = document.querySelector('.winContainer');
    winContainer.style.display = "flex";
}


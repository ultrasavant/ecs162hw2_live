// Open source as described in footer:
// Oregairu Album Quiz derived from DreissenZulu with MIT License: https://github.com/DreissenZulu/JS-Quiz-Game

// Initialize globals
var answerText = "";
var time = 15 * questions.length;
var timeLimit;
var questionDiv = document.querySelector("#questionBlock");
var alertBoxDiv = document.querySelector("#alertBox");
var answerDiv = document.querySelector("#answerResult");
var endGameDiv = document.querySelector("#endGameBlock");
var optionButtons = [document.querySelector("#quizOption1"), document.querySelector("#quizOption2"),
document.querySelector("#quizOption3"), document.querySelector("#quizOption4")]

var questionNum = 0;
var scoresArray;


// Do some fancy animations to hide the title screen and show the quiz
function startQuiz(startEvent) {
    startEvent.stopPropagation();

    document.querySelector("#titleScreen").style = "animation-play-state: running;"
    document.querySelector(".navbar-text").textContent = "Time: " + time;

    // Replace placeholder with the first question
    changeQuestion();

    // Wait for the title animation to finish, then show the question
    setTimeout(function () {
        document.querySelector("#titleScreen").style = "display: none;";
        document.querySelector("#questionBlock").style = "display: block;";
        document.querySelector("#questionBlock").className = "slideUp";
    }, 400);

    timeLimit = setInterval(function () {
        time--;
        document.querySelector(".navbar-text").textContent = "Time: " + time;
        if (time <= 0) {
            clearInterval(timeLimit);
            showEndGame();
        }
    }, 1000);
}

// changeQuestion operates only when the element clicked is a button
function changeQuestion() {
    var questionInfo = questions[questionNum];

    // ...If there are no questions left, stop the timer and end the function...
    if (questionInfo == undefined) {
        clearInterval(timeLimit);
        showEndGame();
        return;
    }

    // ...Otherwise write the information into the next question...
    setTimeout(function () {
        for (var i = 0; i < optionButtons.length; i++) {
            optionButtons[i].textContent = i + 1 + '. ' + questionInfo.choices[i];
            optionButtons[i].value = questionInfo.choices[i];
        }
        document.querySelector("#questionPrompt").textContent = questionInfo.title;
        // ...And show the question
        questionDiv.className = "questionFadeIn";
    }, 400);

}

function checkAnswer(checkEvent) {
    // Check answer only if clicked button
    if (checkEvent.target.nodeName != "BUTTON") {return;}
    const playerAnswer = checkEvent.target.value;

    // If answer is null, skip to next question
    if (!playerAnswer) {
        questionNum++;
        changeQuestion();
        return;
    }
  
    // Player clicked valid answer, evaluate
    if (playerAnswer === questions[questionNum].answer) {
        answerText = "Correct!";
        // If there is not enough time left over, set time to 0
    } else {
        answerText = "Wrong!";
        time -= 15;
        if (time <= 0) {
            time = 0;
        }
    }

    // This block shows the result of the answer, then hides it after a given time.
    answerDiv.innerHTML = `<hr /> ${answerText}`
    if (answerDiv.style != "display: block;") {
        answerDiv.style = "display: block;";
    }
    answerDiv.className = "answerSlideUp";
    setTimeout(function () {
        answerDiv.className = "fadeAway";
        setTimeout(function () {
            answerDiv.style = "display: none;";
        }, 300);
    }, 700);

    // Slide away the current question to prepare the next
    questionDiv.className = "questionFadeOut";
    
    // questionNum is iterated and the next question is called
    questionNum++;
    changeQuestion();
    
}

function showEndGame() {
    // Rewrites remaining time if the final question was wrong
    document.querySelector(".navbar-text").textContent = "Time: " + time;

    // Writes the final score to showScore
    if (time >= 0) {
        document.querySelector("#showScore").textContent = time;
    } else {
        document.querySelector("#showScore").textContent = "0";
    }

    // Animation handlers
    if (questionDiv.className != "questionFadeOut") {
        questionDiv.className = "questionFadeOut";
    }
    setTimeout(function () {
        questionDiv.style = "display: none;";
        answerDiv.style = "display: none;";
        endGameDiv.style = "display: block;";
        endGameDiv.className = "slideDown";
    }, 700)
}

function submitAndSaveScore(event) {
    event.preventDefault();
    

    if (playerInitials.value.trim() == '') {
        if (alertBoxDiv.style != "display:block;") {
            alertBoxDiv.style = "display:block;";

            setTimeout(function () {
                alertBoxDiv.style = "display: none;";
            }, 1000);
        }
        return;
    } else {
        var newHighScore = {
            initials: playerInitials.value.toUpperCase().trim(),
            score: time
        };
        scoresArray.push(newHighScore);
        scoresArray.sort(function (a, b) { return b.score - a.score });
        localStorage.setItem("localHighScores", JSON.stringify(scoresArray));
        window.location.href = "./scores.html"
    }
}

document.addEventListener('DOMContentLoaded', () => {
    let startBtn = document.querySelector("#quizStart");
    let submitBtn = document.querySelector("#submitButton")

    loadHighScores();
    // Initialize
    var playerInitials = document.querySelector("#playerInitials");
    playerInitials.value = '';

    startBtn.addEventListener("click", startQuiz);
    submitBtn.addEventListener("click", submitAndSaveScore);
    document.addEventListener("click", checkAnswer);
    
});

function loadHighScores() {
    // If high scores exist, import it
    let getHighScores = localStorage.getItem("localHighScores");
    if (getHighScores) {
        scoresArray = JSON.parse(getHighScores);
    } else {
        scoresArray = [];
    }
}

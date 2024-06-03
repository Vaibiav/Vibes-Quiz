const startButton = document.querySelector("#start-btn");
const restartButton = document.querySelector("#restart-btn");
const paperDifficulty = document.querySelector("#difficulty");
const questionContainerElement = document.querySelector("#question-container");
const resultContainerElement = document.querySelector("#result-container");
const okButton = document.querySelector(".ok-btn");
const questionElement = document.querySelector("#question");
const answerButtonsElement = document.querySelector("#answer-buttons");
const scoreElement = document.querySelector("#score");
const levelDisplay = document.querySelector("h2");
const timeElement = document.querySelector("#time");

const calculator = document.querySelector("#calculator");
const calcInput = document.querySelector("#calci-input");
const calcButtons = document.querySelectorAll(".num");
const calcEqual = document.querySelector("#calci-equal");
const calcClear = document.querySelector("#calci-clear");



calcButtons.forEach(button => {
    button.addEventListener("click", () => {
        calcInput.value += button.dataset.value;
    });
});

calcEqual.addEventListener("click", () => {
    try {
        calcInput.value = eval(calcInput.value);
    } catch {
        calcInput.value = "Error";
    }
});

calcClear.addEventListener("click", () => {
    calcInput.value = "";
});

let currentQuestionIndex = 0;
let score = 0;
let questionPaper;
let stopwatch;
let finalTime = 0;
let totalTimes = [];
let same;
let fafer;
let startTime;

const easyQuestions = [
    {
        question: "What is the capital of France?",
        answers: [
            { text: "Berlin", correct: false },
            { text: "Madrid", correct: false },
            { text: "Paris", correct: true },
            { text: "Lisbon", correct: false }
        ]
    },
    {
        question: "What is the value of 4+8/4-2*4",
        answers: [
            { text: "3/2", correct: false },
            { text: "1", correct: false },
            { text: "-3", correct: false },
            { text: "-2", correct: true }
        ]
    },
    {
        question: "What is the largest planet in our solar system?",
        answers: [
            { text: "Earth", correct: false },
            { text: "Jupiter", correct: true },
            { text: "Saturn", correct: false },
            { text: "Mars", correct: false }
        ]
    },
    {
        question: "What is the chemical symbol for water?",
        answers: [
            { text: "H2O", correct: true },
            { text: "CO2", correct: false },
            { text: "O2", correct: false },
            { text: "NaCl", correct: false }
        ]
    },
    {
        question: "How many questions did you answer till now?",
        answers: [
            { text: "4", correct: true },
            { text: "3", correct: false },
            { text: "5", correct: false },
            { text: "6", correct: false }
        ]
    }
];
const moderateQuestions = [
    {
        question: "What is the length of latus rectum of the equation: y^2 = 12x",
        answers: [
            { text: "4", correct: false },
            { text: "24", correct: false },
            { text: "12", correct: true },
            { text: "6", correct: false }
        ]
    },
    {
        question: "Which is the hottest planet in the Solar System?",
        answers: [
            { text: "Venus", correct: true },
            { text: "Mercury", correct: false },
            { text: "Mars", correct: false },
            { text: "Sun", correct: false }
        ]
    },
    {
        question: "What is the color of the fur of a polar bear:",
        answers: [
            { text: "peach", correct: false },
            { text: "white", correct: false },
            { text: "black", correct: true },
            { text: "grey", correct: false }
        ]
    },
    {
        question: "How many questions do you think you attempted correct?",
        answers: [
            { text: "0", correct: false },
            { text: "1", correct: false },
            { text: "2", correct: false },
            { text: "3", correct: false }
        ]
    },
    {
        question: "If a car moves at a speed of 10km/hr, how much time does it takes to cover a distance of 10km?",
        answers: [
            { text: "100 hours", correct: false },
            { text: "20 hours", correct: false },
            { text: "1 hour", correct: true },
            { text: "50 hours", correct: false }
        ]
    }
];
const hardQuestions = [
    {
        question: "If you have taken a stock from the stock market, and in the first week it has lost 50% of its earnings, and in the second week earned 50% of it, how much do you have now as from start?",
        answers: [
            { text: "no loss neither gain", correct: false },
            { text: "gained 25%", correct: false },
            { text: "gained 50%", correct: false },
            { text: "lost 25%", correct: true }
        ]
    },
    {
        question: "A lily pad grows so that each day it doubles its size (area). On the 20th day of its life, it completely covers the pond. On what day of its life was the pond half covered?",
        answers: [
            { text: "9th day", correct: false },
            { text: "10th day", correct: false },
            { text: "19th day", correct: true },
            { text: "11th day", correct: false }
        ]
    },
    {
        question: "If you have an oil lamp, petrol, an LPG gas cylinder and a lighter to light them, which one do you light first?",
        answers: [
            { text: "petrol", correct: false },
            { text: "LPG gas cylinder", correct: false },
            { text: "oil lamp", correct: false },
            { text: "Lighter", correct: true }
        ]
    },
    {
        question: "If you are going to answer an MCQ question having four options, what are the chances that you will get it right?",
        answers: [
            { text: "50%", correct: false },
            { text: "25%", correct: false },
            { text: "0%", correct: false },
            { text: "25%", correct: false }
        ] // There is no correct option for this, because it is like a paradoxial question
    },
    {
        question: "How is the quiz website that I created?",
        answers: [
            { text: "Extraordinary", correct: false },
            { text: "Good", correct: true },
            { text: "Ok", correct: false },
            { text: "Not upto the Mark", correct: false }
        ]
    }
    
];

okButton.classList.add("hide");
startButton.addEventListener("click", startGame);
restartButton.addEventListener("click", startGame);

function shuffleQuestions(questions) {
    if (fafer === "Easy") {
        prompt("Easy");
        let fixedquestion = questions.pop();
        shuffleArray(questions);
        questions.push(fixedquestion);
    } else if (fafer === "Moderate") {
        prompt("Moderate");
        // let fixedQuestion = questions.slice(3,4);
        // questions.splice(3,1)[0];
        // questions = shuffleArray(questions);
        // questions.splice(3,0,fixedQuestion);
    } else {
        prompt("Difficult");
        let fixedquestion = questions.pop();
        shuffleArray(questions);
        questions.push(fixedquestion);
    }
    return questions;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function startGame() {
    startButton.classList.add("hide");
    restartButton.classList.add("hide");
    paperDifficulty.classList.add("hide");
    resultContainerElement.classList.add("hide");
    questionContainerElement.classList.remove("hide");
    currentQuestionIndex = 0;
    score = 0;
    totalTimes = []; // Reset total times
    finalTime = 0; // Reset final time
    let selectedDifficulty = paperDifficulty.value;
    if (selectedDifficulty === "easy") {
        fafer = "Easy";
        questionPaper = shuffleQuestions(easyQuestions);
        same = false;
    } else if (selectedDifficulty === "moderate") {
        fafer = "Moderate";
        questionPaper = shuffleQuestions(moderateQuestions);
        same = true;
    } else {
        fafer = "Difficult";
        questionPaper = shuffleQuestions(hardQuestions);
        same = false;
    }

    levelDisplay.innerText = "Quiz level:" + fafer;
    selectPaper(questionPaper[currentQuestionIndex]);
}

function selectPaper(questionPaper) {
    startStopwatch();
    okButton.classList.add("hide");
    questionElement.innerText = questionPaper.question;
    answerButtonsElement.innerHTML = "";
    if (currentQuestionIndex === 3 && same) {
        let k = 0;
        questionPaper.answers.forEach(answer => {
            let ans = (score === k);
            if (ans) { answer.correct = true } k++;
        });
    }
    questionPaper.answers.forEach(answer => {
        const button = document.createElement("button");
        button.innerText = answer.text;
        button.classList.add("btn");
        if (answer.correct) {
            button.dataset.correct = answer.correct;
        }
        button.addEventListener("click", selectAnswer);
        answerButtonsElement.appendChild(button);
    });
    if (currentQuestionIndex === 3 && same) {
        let k = 0;
        questionPaper.answers.forEach(answer => {
            answer.correct = false;
            k++;
        });
    }
}

function selectAnswer(e) {  
    clearInterval(stopwatch);
    const selectedButton = e.target;
    const correct = selectedButton.dataset.correct === "true";
    if (correct) {
        score++;
        selectedButton.classList.add("Green");
    } else {
        Array.from(answerButtonsElement.children).forEach(button => {
            if (button.dataset.correct === "true") {
                button.classList.add("Green");
            }
        });
        selectedButton.classList.add("red");
    }

    // Save the time taken for the current question
    const timeTaken = (Date.now() - startTime) / 1000;
    totalTimes.push(timeTaken);

    okButton.classList.remove("hide");
    okButton.removeEventListener("click", OkButton); // Remove previous event listener if any
    okButton.addEventListener("click", OkButton, { once: true });
}

function OkButton() {
    if (currentQuestionIndex < questionPaper.length - 1) {
        currentQuestionIndex++;
        selectPaper(questionPaper[currentQuestionIndex]);
    } else {
        endGame();
    }
}

function startStopwatch() {
    clearInterval(stopwatch);
    startTime = Date.now();
    stopwatch = setInterval(() => {
        const timeTaken = (Date.now() - startTime) / 1000;
        timeElement.innerText = `Time: ${timeTaken.toFixed(2)}s`;
    }, 10);
}

function endGame() {
    clearInterval(stopwatch);
    questionContainerElement.classList.add("hide");
    resultContainerElement.classList.remove("hide");
    if(score >= 5){
        scoreElement.innerText = `Score: 5`;
    }else{
        scoreElement.innerText = `Score: ${score}`;
    }
    
    const totalTime = totalTimes.reduce((acc, time) => acc + time, 0);
    timeElement.innerText = `Total time taken: ${totalTime.toFixed(2)}s`;
    
    paperDifficulty.classList.remove("hide");
    restartButton.classList.remove("hide");
    
}

import { createModal } from "./modal.js";
import { getQuestion } from "./data.js";
import { createChart } from "./myChart.js";

export let history = [];
let ind = 0;
let timer;
let correctAnswer;
const totalTime = 30;
export const totalQuestion = 10;
let timeLeft = totalTime;
let isloading = false;
let isAnswered = false;
var score = [0, 0, 0];

var btn1 = document.getElementById("option1");
var btn2 = document.getElementById("option2");
var btn3 = document.getElementById("option3");
var btn4 = document.getElementById("option4");
var nextBtn = document.getElementById("nextBtn");
var explain = document.getElementById("explaination");
let timerElement = document.getElementById("timer");
let progressBar = document.getElementById("progress-bar");
let questionCount = document.getElementById("question-number");
let gamePage = document.getElementById('game-page')
let landingPage = document.getElementById('landing-page')
let resultPage = document.getElementById('result-page')
let Questions = [];

// Fetch all questions at once
async function fetchAllQuestions(topic) {
    let prompt = `You are hosting a Quiz game server.
    Respond only in JSON format, without any extra words because your response will be parsed by code.
    Response format:
    {
        "questions": [
            {"question": "Sample1", "options": ["option1", "option2", "option3", "option4"], "answer": "option4", "explanation": "Explanation."},
            {"question": "Sample1", "options": ["option1", "option2", "option3", "option4"], "answer": "option4", "explanation": "Explanation."},
            {"question": "Sample1", "options": ["option1", "option2", "option3", "option4"], "answer": "option4", "explanation": "Explanation."},
        ]
    }
    error format:
    {
        "error": "error message"
    }
    Rules for Input Validation: 
    Check if the input is a meaningful word or phrase.
    If the input is empty, return a failure response.
    If the input contains random characters, gibberish, numbers only, or symbols (e.g., "asdkj23", "@#%$^"), return a failure response. 
    If the input is not a recognizable topic or not relevant to knowledge or education, return a failure response. 
    If the user provides this topic exactly, proceed with the quiz. 
    If the user provides anything else, return a failure response.
    
    So let's start, Generate ${totalQuestion} quiz questions at once for the topic: '${topic}'`;
    
    history = [{ role: "user", content: prompt }];
    try {
        gamePage.classList.add('fadeout')
        const rawResponse = await getQuestion(history);
        const resObj = JSON.parse(rawResponse.content);
        // console.log('parsed: ', resObj);

        if (resObj.questions) {
            landingPage.classList.add('fadeout')
            Questions = resObj.questions;
            // history.push(rawResponse);
            landingPage.classList.add('fadeout')
            setTimeout(() => {
                document.getElementById('landing-page').style.display = 'none';
                document.getElementById('game-page').style.display = 'flex';
                // console.log('inside fetch questions');
                loadQuestion();
                startTimer()
            }, 500);            
        } else {
            createModal("Error", resObj.error);
        }
    } catch (error) {
        createModal("Error", error.message);
    }
}

function loadQuestion() {
    let obj = Questions[ind];
    correctAnswer = obj.answer
    // console.log('correct answer: ', correctAnswer);
    
    document.getElementById("question").textContent = obj.question;
    btn1.textContent = obj.options[0];
    btn2.textContent = obj.options[1];
    btn3.textContent = obj.options[2];
    btn4.textContent = obj.options[3];
    resetStyles();
    nextBtn.style.display = "none";
    explain.style.display = "none";
    questionCount.textContent = `${ind + 1} out of ${totalQuestion}`;
    
    setTimeout(() => {  
        // console.log('loading question');
        gamePage.classList.remove('fadeout')
        gamePage.classList.add('fadein')
    }, 800);
}

function resetStyles() {
    btn1.style.background = 'transparent';
    btn2.style.background = 'transparent';
    btn3.style.background = 'transparent';
    btn4.style.background = 'transparent';
}

btn1.addEventListener("click", () => checkAnswer(btn1));
btn2.addEventListener("click", () => checkAnswer(btn2));
btn3.addEventListener("click", () => checkAnswer(btn3));
btn4.addEventListener("click", () => checkAnswer(btn4));

function checkAnswer(button) {
    if (isAnswered) return;
    isAnswered = true;
    // button.textContent = "checking...";
    
    let isCorrect = button.textContent === Questions[ind].answer;
    
    if (isCorrect) {
        score[0]++;
        button.style.background = "green";
    } else {
        score[1]++;
        button.style.background = "red";
        showCorrectAnswer();
    }
    
    explain.style.display = "block";
    document.getElementById("content").textContent = Questions[ind].explanation;;
    nextBtn.style.display = "inline";
    // button.textContent = correctAnswer;
    stopTimer();
}

// timer
function updateTimer() {
    // console.log(timeLeft)
    
    if (timeLeft > 0) {
        timeLeft--;
        timerElement.textContent = timeLeft + "s";
        progressBar.style.width = ((totalTime - timeLeft) / totalTime) * 100 + "%";
    } else {
        stopTimer()
        score[2]++;
        timerElement.textContent = "Time's up!";
        showCorrectAnswer();
        setTimeout(() => {
            timerElement.textContent = "Loading Next Question";
            setTimeout(() => {
                showNextQues()
            }, 2000);
            
        }, 2000);
    }
}

function startTimer(){
    // if(timer != null){
    //     return;
    // }
    // console.log('created timer');
    timerElement.textContent = timeLeft + "s"
    timer = setInterval(updateTimer, 1000);
}

function stopTimer(){
    clearInterval(timer)
    timer = null;
    // console.log('timer stoped');
}

function resetTimer(){
    stopTimer()
    timerElement.textContent = totalTime;
    progressBar.style.width = '0%';
    timeLeft = totalTime;
}


function showCorrectAnswer() {
    // console.log('showing correct answer');
    
    [btn1, btn2, btn3, btn4].forEach(btn => {
        // console.log('matching', btn, ' ', correctAnswer);
        
        if (btn.textContent == correctAnswer) {
            // console.log('correct is', btn.textContent);
            btn.style.background = "green";
        }
    });
}

nextBtn.addEventListener("click", () => {
    isAnswered = false;
    showNextQues()
});

function showNextQues(){
    ind++;
    gamePage.classList.remove('fadein')
    gamePage.classList.add('fadeout')
    setTimeout(() => {
        if (ind >= Questions.length) {
            stopTimer();
            showRes();
            return;
        }
        loadQuestion();
        resetTimer(),
        gamePage.classList.remove('fadeout')
        gamePage.classList.add('fadein')
        setTimeout(() => {
            startTimer()
        }, 500);
    }, 500);
}

function showRes() {
    gamePage.style.display = "none";
    resultPage.style.display = "flex";
    createChart(score);
    // resultPage.classList.add('fadein')
}

const startButton = document.getElementById("start-quiz");
startButton.addEventListener("click", async () => {
    if(isloading)   return;
    isloading = true
    let input = document.getElementById("topic-input").value;
    startButton.textContent = "";
    startButton.classList.add("button--loading");
    // console.log('start button pressed');
    
    await fetchAllQuestions(input);
    startButton.classList.remove("button--loading");
    startButton.textContent = "Let's Go!";
    isloading = false;
});

// Add a reset function similar to temp.js
function reset() {
    score = [0, 0, 0];
    history = [];
    ind = 0;
    isAnswered = false;
    Questions = [];
    stopTimer();
    resultPage.classList.remove('fadein')
    resultPage.classList.add('fadeout')
    setTimeout(() => {
        document.getElementById('result-page').style.display = "none";
        document.getElementById('landing-page').style.display = "flex";
        landingPage.classList.remove('fadeout')
        landingPage.classList.add('fadein')
        setTimeout(() => {
            location.reload();
        }, 500);
    }, 500);
}

// Add event listener for try again button if it exists in your HTML
document.getElementById('try-again')?.addEventListener('click', () => {
    reset();
});

let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let timerInterval;
let timeLeft = 10;

// obtain dom element
const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const feedbackEl = document.getElementById("feedback");
const qNumEl = document.getElementById("qNum");
const scoreEl = document.getElementById("score");
const playAgainBtn = document.getElementById("btnPlayAgain");
const timerEl = document.getElementById("timer");


// load JSON file and display question and its options randomly
fetch("question.json")
  .then(response => {
    if (!response.ok) throw new Error("HTTP error " + response.status);
    return response.json();
  })
  .then(data => {
    questions = data;
    for (let i = questions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [questions[i], questions[j]] = [questions[j], questions[i]];
    }
    // generate 10 questions
    questions = questions.slice(0, 10);
    loadQuestion();
  })
  .catch(error => {
   
    questionEl.textContent = "Fail to load question";
  });

  function startTimer() {
    timeLeft = 10;
    timerEl.textContent = timeLeft;
  timerEl.style.color = "#8B0000"; 

  timerInterval = setInterval(() => {
    timeLeft--;
    timerEl.textContent = timeLeft;

    if (timeLeft <= 5) {
      timerEl.style.color = "#ff4500";
    }

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      timeUp();
    }
  }, 1000);
}

document.querySelector('.btn-start').addEventListener('click', function() {
  timerEl.classList.add('active'); // display timer
  startTimer(); 
});


function timeUp() {
   const buttons = optionsEl.querySelectorAll("button");
  buttons.forEach(btn => btn.disabled = true);

  const q = questions[currentQuestionIndex];
  feedbackEl.textContent = `Time's up! Correct answer is : "${q.options[q.correct]}". ${q.explanation}`;
  feedbackEl.style.color = "#8B0000";
  setTimeout(nextQuestion,3000);
}
  

// load question
function loadQuestion() {
  if (currentQuestionIndex >= questions.length) {
    questionEl.textContent = "Quiz Completed!";
    optionsEl.innerHTML = "";
    feedbackEl.textContent = `Final Score : ${score} / ${questions.length * 10}`;
    feedbackEl.style.color = "";
    feedbackEl.style.fontSize = "2rem";
    document.getElementById("btnPlayAgain").style.display = "inline-block";
    clearInterval(timerInterval);
    return;
  }

  const q = questions[currentQuestionIndex];
  questionEl.textContent = q.question;
  qNumEl.textContent = currentQuestionIndex + 1;
  optionsEl.innerHTML = "";
  feedbackEl.textContent = "";
  

  const shuffledOptions = [...q.options];
  for (let i = shuffledOptions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledOptions[i], shuffledOptions[j]] = [shuffledOptions[j], shuffledOptions[i]];
  }

  shuffledOptions.forEach(option => {
    const btn = document.createElement("button");
    btn.textContent = option;
    btn.style.padding = "1.2rem";
    btn.style.background = "#001f3f";
    btn.style.color = "white";
    btn.style.border = "none";
    btn.style.borderRadius = "8px";
    btn.style.cursor = "pointer";
    btn.style.fontSize = "1.2rem";
    btn.onclick = () => {
      clearInterval(timerInterval); 
      checkAnswer(option, q.options[q.correct], q.explanation);
    };
    
    optionsEl.appendChild(btn);
  });
  startTimer();
}

// check answer
function checkAnswer(selected, correctAnswer, explanation) {
  const buttons = optionsEl.querySelectorAll("button");

  buttons.forEach(btn => {
    btn.disabled = true;
    if (btn.textContent === correctAnswer) {
      btn.style.background = "#28a745"; 
    }
    if (btn.textContent === selected) {
      if (selected === correctAnswer) {
        score += 10;
        feedbackEl.textContent = `Correct! ${explanation}`;
        feedbackEl.style.color = "#28a745";
      } else {
        feedbackEl.textContent = `Wrong! Correct is "${correctAnswer}". ${explanation}`;
        feedbackEl.style.color = "#8B0000";
        btn.style.background = "#dc3545"; 
      }
    }
  });

  scoreEl.textContent = score;
  setTimeout(nextQuestion,3000);
  
}

// next question
function nextQuestion() {
 currentQuestionIndex++;
  loadQuestion();
}


playAgainBtn.onclick = () => {
  currentQuestionIndex = 0;
  score = 0;
  scoreEl.textContent = score;
  qNumEl.textContent = 1;
  feedbackEl.textContent = "";
  optionsEl.innerHTML = "";
  playAgainBtn.style.display = "none";
  loadQuestion();
}
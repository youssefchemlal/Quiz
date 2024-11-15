let currentQuestion = 0;
let score = 0;
let hasAnswered = false;
let timer;
let totalTime = 0;
let correctAnswers = 0;
let wrongAnswers = 0;

const questions = [
    {
        type: "qcm",
        question: "Quel est le symbole chimique de l'eau ?",
        options: ["O2", "H2O", "CO2"],
        correct: 1,
        explanation: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum."
    },
    {
        type: "true-false",
        question: "Le stress peut causer des problèmes physiques.",
        correct: true,
        explanation: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum."
    },
    {
        type: "qcm",
        question: "Combien de jours y a-t-il dans une année bissextile ?",
        options: ["365", "366", "367"],
        correct: 1,
        explanation: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum."
    },
    {
        type: "true-false",
        question: "La dépression est un simple manque de volonté d'être heureux.",
        correct: false,
        explanation: "La dépression est une condition médicale complexe qui implique des facteurs biologiques et psychologiques."
    },
    {
        type: "true-false",
        question: "Faire de l'exercice régulièrement peut aider à améliorer la santé mentale.",
        correct: true,
        explanation: "L'exercice physique stimule la production d'endorphines qui améliorent l'humeur."
    },
    {
        type: "text",
        question: "Quelle est la capitale de la France ?",
        answers: ["paris", "Paris", "PARIS"],
        closeAnswers: ["pari", "pariz", "parie"],
        explanation: "Paris est la capitale de la France depuis 508.",
        suggestions: ["Pensez à la ville avec la Tour Eiffel", "C'est une ville qui commence par P"]
    }
];

function startTimer() {
    let timeLeft = 30;
    clearInterval(timer);
    
    document.getElementById('countdown').textContent = timeLeft;
    
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById('countdown').textContent = timeLeft;
        totalTime++;
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            if (!hasAnswered) {
                if (questions[currentQuestion].type === "qcm") {
                    checkAnswer(-1);
                } else {
                    checkTrueFalse(null);
                }
            }
        }
    }, 1000);
}

function showQuestion() {
    const question = questions[currentQuestion];
    hasAnswered = false;
    
    updateQuestionType(question.type);
    
    document.getElementById('current-question').textContent = currentQuestion + 1;
    document.getElementById('total-questions').textContent = questions.length;
    
    if (question.type === "qcm") {
        document.querySelector('[data-type="qcm"]').classList.remove('hidden');
        document.querySelector('[data-type="true-false"]').classList.add('hidden');
        
        document.querySelector('.question01 h1').textContent = question.question;
        const buttons = document.querySelectorAll('.option');
        buttons.forEach((btn, i) => {
            btn.innerHTML = `<span class="option-letter">${String.fromCharCode(65 + i)}</span> ${question.options[i]}`;
            btn.className = 'option';
            btn.disabled = false;
        });
        document.getElementById('suivant').classList.add('hidden');
    } else if (question.type === "true-false") {
        document.querySelector('[data-type="qcm"]').classList.add('hidden');
        document.querySelector('[data-type="true-false"]').classList.remove('hidden');
        
        document.querySelector('.question-text').textContent = question.question;
        resetTrueFalseButtons();
    } else if (question.type === "text") {
        document.querySelector('[data-type="qcm"]').classList.add('hidden');
        document.querySelector('[data-type="true-false"]').classList.add('hidden');
        document.querySelector('[data-type="text"]').classList.remove('hidden');
        
        const input = document.getElementById('text-answer');
        input.value = '';
        input.disabled = false;
        input.classList.remove('correct', 'incorrect');
        
        document.getElementById('submit-text').disabled = false;
        document.getElementById('suivant-text').classList.add('hidden');
        document.querySelector('.suggestion-box').classList.add('hidden');
        document.querySelector('.explanation').classList.add('hidden');
    }
    
    startTimer();
    
    updateProgress();
}

function checkAnswer(index) {
    if (hasAnswered) return;
    hasAnswered = true;
    
    clearInterval(timer);
    const question = questions[currentQuestion];
    const buttons = document.querySelectorAll('.option');
    
    buttons.forEach(btn => btn.disabled = true);
    
    if (index === question.correct) {
        buttons[index].classList.add('correct');
        score += 15;
        correctAnswers++;
        document.getElementById('score').textContent = score;
    } else {
        if (index >= 0) {
            buttons[index].classList.add('incorrect');
            score -= 15;
            const explanationDiv = document.createElement('div');
            explanationDiv.className = 'explanation';
            explanationDiv.innerHTML = `
                <p class="explanation-text">
                    <i class="fas fa-info-circle"></i>
                    ${question.explanation}
                </p>
            `;
            document.querySelector('.buttons-container').appendChild(explanationDiv);
        }
        buttons[question.correct].classList.add('correct');
        wrongAnswers++;
        document.getElementById('score').textContent = score;
    }
    
    document.getElementById('suivant').classList.remove('hidden');
}

function checkTrueFalse(answer) {
    if (hasAnswered) return;
    hasAnswered = true;
    
    clearInterval(timer);
    const question = questions[currentQuestion];
    const trueBtn = document.getElementById('true-button');
    const falseBtn = document.getElementById('false-button');
    const explanation = document.querySelector('.explanation');
    
    if (answer === question.correct) {
        answer ? trueBtn.classList.add('correct') : falseBtn.classList.add('correct');
        score += 15;
        correctAnswers++;
        document.getElementById('score').textContent = score;
    } else {
        answer ? trueBtn.classList.add('incorrect') : falseBtn.classList.add('incorrect');
        question.correct ? trueBtn.classList.add('correct') : falseBtn.classList.add('correct');
        score -= 15;
        wrongAnswers++;
        document.getElementById('score').textContent = score;
        
        explanation.classList.remove('hidden');
        explanation.querySelector('.explanation-text').innerHTML = `
            <i class="fas fa-info-circle"></i>
            ${question.explanation}
        `;
    }
    
    document.getElementById('suivant-tf').classList.remove('hidden');
    trueBtn.disabled = true;
    falseBtn.disabled = true;
}

function nextQuestion() {
    currentQuestion++;
    if (currentQuestion < questions.length) {
        showQuestion();
    } else {
        showResults();
    }
}

function updateProgress() {
    const progressBar = document.getElementById('progress');
    const progress = ((currentQuestion + 1) / questions.length) * 100;
    progressBar.style.width = `${progress}%`;
}

function showResults() {
    clearInterval(timer);
    document.querySelector('.content-quiz').classList.add('hidden');
    const resultsDiv = document.querySelector('.quiz-results');
    resultsDiv.classList.remove('hidden');
    
    saveQuizResult();
    
    document.getElementById('final-score').textContent = score;
    document.getElementById('correct-answers').textContent = correctAnswers;
    document.getElementById('wrong-answers').textContent = wrongAnswers;
    document.getElementById('total-time').textContent = totalTime;
    
    const bestScore = localStorage.getItem('bestScore') || 0;
    if (!document.getElementById('best-score')) {
        const bestScoreDiv = document.createElement('div');
        bestScoreDiv.innerHTML = `<h3>Meilleur Score</h3><p><span id="best-score">${bestScore}</span> points</p>`;
        document.querySelector('.score-final').appendChild(bestScoreDiv);
    } else {
        document.getElementById('best-score').textContent = bestScore;
    }
    
    displayQuizHistory();
}

function displayQuizHistory() {
    const quizHistory = JSON.parse(localStorage.getItem('quizHistory')) || [];
    const historyDiv = document.createElement('div');
    historyDiv.className = 'quiz-history';
    historyDiv.innerHTML = `
        <h3>Historique des Quiz</h3>
        <div class="history-list">
            ${quizHistory.reverse().map(result => `
                <div class="history-item">
                    <div class="history-date">${result.date}</div>
                    <div class="history-score">Score: ${result.score}</div>
                    <div class="history-details">
                        ✓ ${result.correctAnswers} | ✗ ${result.wrongAnswers} | ⏱ ${result.totalTime}s
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    
    const existingHistory = document.querySelector('.quiz-history');
    if (existingHistory) {
        existingHistory.replaceWith(historyDiv);
    } else {
        document.querySelector('.results-content').appendChild(historyDiv);
    }
}

function saveQuizResult() {
    const quizResult = {
        date: new Date().toLocaleString(),
        score: score,
        correctAnswers: correctAnswers,
        wrongAnswers: wrongAnswers,
        totalTime: totalTime
    };

    let quizHistory = JSON.parse(localStorage.getItem('quizHistory')) || [];
    
    quizHistory.push(quizResult);
    
    if (quizHistory.length > 10) {
        quizHistory = quizHistory.slice(-10);
    }
    
    localStorage.setItem('quizHistory', JSON.stringify(quizHistory));
    
    const bestScore = localStorage.getItem('bestScore') || 0;
    if (score > bestScore) {
        localStorage.setItem('bestScore', score);
    }
}

const style = document.createElement('style');
style.textContent = `
    .quiz-history {
        margin-top: 20px;
        padding: 15px;
        background-color: #f8f9fa;
        border-radius: 8px;
    }

    .history-list {
        max-height: 200px;
        overflow-y: auto;
    }

    .history-item {
        padding: 10px;
        border-bottom: 1px solid #dee2e6;
        margin-bottom: 5px;
    }

    .history-date {
        font-size: 0.9em;
        color: #6c757d;
    }

    .history-score {
        font-weight: bold;
        color: #28a745;
    }

    .history-details {
        font-size: 0.9em;
        color: #6c757d;
        margin-top: 5px;
    }
`;
document.head.appendChild(style);

function restartQuiz() {
    currentQuestion = 0;
    score = 0;
    hasAnswered = false;
    totalTime = 0;
    correctAnswers = 0;
    wrongAnswers = 0;
    
    document.getElementById('score').textContent = '0';
    document.querySelector('.quiz-results').classList.add('hidden');
    document.querySelector('.content-quiz').classList.remove('hidden');
    
    showQuestion();
}

window.onload = function() {
    document.getElementById('total-questions').textContent = questions.length;
    showQuestion();
};

function checkTextAnswer(value) {
    if (hasAnswered) return;
    
    const question = questions[currentQuestion];
    const input = document.getElementById('text-answer');
    const suggestionBox = document.querySelector('.suggestion-box');
    
    const isClose = question.closeAnswers.some(answer => 
        value.toLowerCase().includes(answer.toLowerCase())
    );
    
    if (isClose && !suggestionBox.classList.contains('hidden')) {
        suggestionBox.innerHTML = question.suggestions
            .map(suggestion => `<div class="suggestion-item">${suggestion}</div>`)
            .join('');
        suggestionBox.classList.remove('hidden');
    } else {
        suggestionBox.classList.add('hidden');
    }
}

function submitTextAnswer() {
    if (hasAnswered) return;
    hasAnswered = true;
    
    clearInterval(timer);
    const question = questions[currentQuestion];
    const input = document.getElementById('text-answer');
    const value = input.value.trim();
    
    const isCorrect = question.answers.some(answer => 
        value.toLowerCase() === answer.toLowerCase()
    );
    
    if (isCorrect) {
        input.classList.add('correct');
        score += 15;
        correctAnswers++;
        document.getElementById('score').textContent = score;
    } else {
        input.classList.add('incorrect');
        score -= 15;
        wrongAnswers++;
        document.getElementById('score').textContent = score;
        
        const explanation = document.querySelector('.explanation');
        explanation.classList.remove('hidden');
        explanation.querySelector('.explanation-text').textContent = question.explanation;
    }
    
    input.disabled = true;
    document.getElementById('submit-text').disabled = true;
    document.getElementById('suivant-text').classList.remove('hidden');
}

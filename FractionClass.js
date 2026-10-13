// ==========================================
// FRACTION CLASS
// ==========================================

class Fraction {

    constructor(numerator, denominator, simplify = true) {

        if (denominator === 0) {
            throw new Error("Denominator cannot be zero.");
        }

        if (denominator < 0) {
            numerator = -numerator;
            denominator = -denominator;
        }

        if (simplify) {
            const common = gcd(
                Math.abs(numerator),
                denominator
            );

            this.num = numerator / common;
            this.den = denominator / common;
        } else {
            this.num = numerator;
            this.den = denominator;
        }
    }

    isSimplified() {
        return gcd(
            Math.abs(this.num),
            this.den
        ) === 1;
    }

    isInteger() {
        return this.den === 1;
    }

    toString(useMixed = false) {
        if (this.den === 1) {
            return String(this.num);
        }

        if (useMixed && Math.abs(this.num) > this.den) {
            const whole = Math.trunc(this.num / this.den);
            const remainder = Math.abs(this.num % this.den);
            return `${whole} ${remainder}/${this.den}`;
        }

        return `${this.num}/${this.den}`;
    }

    equals(other) {
        return (
            this.num * other.den ===
            other.num * this.den
        );
    }

    add(other) {
        return new Fraction(
            this.num * other.den + other.num * this.den,
            this.den * other.den
        );
    }

    subtract(other) {
        return new Fraction(
            this.num * other.den - other.num * this.den,
            this.den * other.den
        );
    }

    multiply(other) {
        return new Fraction(
            this.num * other.num,
            this.den * other.den
        );
    }

    divide(other) {
        if (other.num === 0) {
            throw new Error("Cannot divide by zero.");
        }
        return new Fraction(
            this.num * other.den,
            this.den * other.num
        );
    }

    static parse(input, simplify = true) {
        input = input.trim();

        // Support Mixed Numbers (e.g., "1 1/2" or "-2 3/4")
        if (input.includes(" ")) {
            const parts = input.split(/\s+/);
            if (parts.length !== 2 || !parts[1].includes("/")) {
                throw new Error("Invalid format.");
            }

            const whole = Number(parts[0]);
            const fracParts = parts[1].split("/");
            if (fracParts.length !== 2) throw new Error("Invalid format.");

            const num = Number(fracParts[0]);
            const den = Number(fracParts[1]);

            if (!Number.isInteger(whole) || !Number.isInteger(num) || !Number.isInteger(den) || den === 0) {
                throw new Error("Invalid number.");
            }

            const isNegative = whole < 0 || Object.is(whole, -0);
            const absoluteNum = (Math.abs(whole) * den) + num;
            const totalNum = isNegative ? -absoluteNum : absoluteNum;

            return new Fraction(totalNum, den, simplify);
        }

        // Support standard improper fractions (e.g., "3/4")
        if (input.includes("/")) {
            const parts = input.split("/");
            if (parts.length !== 2) throw new Error("Invalid format.");

            const numerator = Number(parts[0]);
            const denominator = Number(parts[1]);

            if (!Number.isInteger(numerator) || !Number.isInteger(denominator)) {
                throw new Error("Invalid number.");
            }

            return new Fraction(numerator, denominator, simplify);
        }

        // Support whole integers
        const number = Number(input);
        if (!Number.isInteger(number)) {
            throw new Error("Invalid number.");
        }

        return new Fraction(number, 1, simplify);
    }
}


function gcd(a, b) {
    while (b !== 0) {
        const temp = b;
        b = a % b;
        a = temp;
    }
    return Math.abs(a);
}


function randomInt(min, max) {
    return Math.floor(
        Math.random() * (max - min + 1)
    ) + min;
}


function generateFraction(forceNonInteger = false, valMin = -10, valMax = 10) {
    while (true) {
        const minDenominator = forceNonInteger ? 2 : 1;
        const denMin = Math.max(minDenominator, 1);
        const denMax = Math.max(Math.abs(valMin), Math.abs(valMax), 10);

        const denominator = randomInt(denMin, denMax);
        const numerator = randomInt(valMin, valMax);

        const fraction = new Fraction(numerator, denominator);

        if (forceNonInteger && fraction.isInteger()) {
            continue;
        }

        return fraction;
    }
}


// ==========================================
// QUIZ & SETTINGS VARIABLES
// ==========================================

let currentQuestion = 0;
let totalQuestions = 0;
let score = 0;
let expectedAnswer = null;
let currentFraction1 = null;
let currentFraction2 = null;
let currentOperator = null;
let questionLocked = false;
let selectedOperators = [];
let rangeMinVal = -10;
let rangeMaxVal = 10;
let allowMixedNumbers = false;
let questionHistory = [];


// ==========================================
// GET HTML ELEMENTS
// ==========================================

const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultsScreen = document.getElementById("results-screen");

const questionCount = document.getElementById("question-count");
const startButton = document.getElementById("start-button");
const submitButton = document.getElementById("submit-button");
const restartButton = document.getElementById("restart-button");
const toggleExplanationsBtn = document.getElementById("toggle-explanations-button");
const explanationsContainer = document.getElementById("explanations-container");
const explanationsList = document.getElementById("explanations-list");

const answerInput = document.getElementById("answer");
const problem = document.getElementById("problem");
const questionNumber = document.getElementById("question-number");
const feedback = document.getElementById("feedback");
const finalScore = document.getElementById("final-score");
const percentage = document.getElementById("percentage");
const resultMessage = document.getElementById("result-message");

const rangeMin = document.getElementById("range-min");
const rangeMax = document.getElementById("range-max");
const useMixedCheckbox = document.getElementById("use-mixed-numbers");

const helpModal = document.getElementById("help-modal");
const modalTitle = document.getElementById("modal-title");
const modalBody = document.getElementById("modal-body");
const closeModalBtn = document.getElementById("close-modal");


// ==========================================
// HELP MODAL GUIDES
// ==========================================

const OPERATOR_GUIDES = {
    "+": {
        title: "Adding Fractions (+)",
        html: `
            <ol>
                <li>Find a common denominator by multiplying bottom numbers: <code>den = b × d</code>.</li>
                <li>Cross-multiply to adjust top numbers: <code>num = (a × d) + (b × c)</code>.</li>
                <li>Simplify the resulting fraction to its lowest terms.</li>
            </ol>
            <div class="example-box">
                <strong>Example:</strong> 1/3 + 1/4<br>
                Bottom: 3 × 4 = 12<br>
                Top: (1 × 4) + (3 × 1) = 7<br>
                Result: <strong>7/12</strong>
            </div>
        `
    },
    "-": {
        title: "Subtracting Fractions (-)",
        html: `
            <ol>
                <li>Find a common denominator by multiplying bottom numbers: <code>den = b × d</code>.</li>
                <li>Cross-multiply and subtract: <code>num = (a × d) - (b × c)</code>.</li>
                <li>Simplify the resulting fraction to its lowest terms.</li>
            </ol>
            <div class="example-box">
                <strong>Example:</strong> 3/4 - 1/2<br>
                Bottom: 4 × 2 = 8<br>
                Top: (3 × 2) - (4 × 1) = 2<br>
                Unsimplified: 2/8 &rarr; <strong>1/4</strong>
            </div>
        `
    },
    "*": {
        title: "Multiplying Fractions (×)",
        html: `
            <ol>
                <li>Multiply the top numbers together: <code>num = a × c</code>.</li>
                <li>Multiply the bottom numbers together: <code>den = b × d</code>.</li>
                <li>Simplify the resulting fraction to its lowest terms.</li>
            </ol>
            <div class="example-box">
                <strong>Example:</strong> 2/3 × 3/5<br>
                Top: 2 × 3 = 6<br>
                Bottom: 3 × 5 = 15<br>
                Unsimplified: 6/15 &rarr; <strong>2/5</strong>
            </div>
        `
    },
    "/": {
        title: "Dividing Fractions (÷)",
        html: `
            <ol>
                <li>Flip the second fraction upside down (reciprocal).</li>
                <li>Multiply the first fraction by this flipped fraction.</li>
                <li>Simplify the resulting fraction to its lowest terms.</li>
            </ol>
            <div class="example-box">
                <strong>Example:</strong> 1/2 ÷ 3/4<br>
                Flip 3/4 &rarr; 4/3<br>
                Multiply: 1/2 × 4/3 = 4/6 &rarr; <strong>2/3</strong>
            </div>
        `
    }
};

document.querySelectorAll(".help-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
        const op = e.target.getAttribute("data-op");
        const guide = OPERATOR_GUIDES[op];
        if (guide) {
            modalTitle.textContent = guide.title;
            modalBody.innerHTML = guide.html;
            helpModal.classList.remove("hidden");
        }
    });
});

closeModalBtn.addEventListener("click", () => {
    helpModal.classList.add("hidden");
});

helpModal.addEventListener("click", (e) => {
    if (e.target === helpModal) {
        helpModal.classList.add("hidden");
    }
});


// ==========================================
// START QUIZ BUTTON
// ==========================================

startButton.addEventListener("click", startQuiz);

function startQuiz() {

    const number = Number(questionCount.value);

    if (!Number.isInteger(number) || number < 1 || number > 50) {
        alert("Please enter a question count between 1 and 50.");
        return;
    }

    selectedOperators = [];
    if (document.getElementById("op-add").checked) selectedOperators.push("+");
    if (document.getElementById("op-sub").checked) selectedOperators.push("-");
    if (document.getElementById("op-mul").checked) selectedOperators.push("*");
    if (document.getElementById("op-div").checked) selectedOperators.push("/");

    if (selectedOperators.length === 0) {
        alert("Please select at least one operation to include.");
        return;
    }

    const minVal = Number(rangeMin.value);
    const maxVal = Number(rangeMax.value);

    if (!Number.isInteger(minVal) || !Number.isInteger(maxVal) || minVal >= maxVal) {
        alert("Please enter a valid range where Minimum is strictly less than Maximum.");
        return;
    }

    rangeMinVal = minVal;
    rangeMaxVal = maxVal;
    allowMixedNumbers = useMixedCheckbox.checked;

    totalQuestions = number;
    currentQuestion = 0;
    score = 0;
    questionHistory = [];

    startScreen.classList.add("hidden");
    quizScreen.classList.remove("hidden");

    generateQuestion();
}


function fractionHTML(fraction) {
    if (fraction.den === 1) {
        return `<span class="integer-number">${fraction.num}</span>`;
    }

    if (allowMixedNumbers && Math.abs(fraction.num) > fraction.den) {
        const whole = Math.trunc(fraction.num / fraction.den);
        const remainder = Math.abs(fraction.num % fraction.den);
        return `
            <span class="mixed-fraction">
                <span class="whole-part">${whole}</span>
                <span class="fraction">
                    <span class="numerator">${remainder}</span>
                    <span class="denominator">${fraction.den}</span>
                </span>
            </span>
        `;
    }

    return `
        <span class="fraction">
            <span class="numerator">${fraction.num}</span>
            <span class="denominator">${fraction.den}</span>
        </span>
    `;
}


// ==========================================
// GENERATE QUESTION
// ==========================================

function generateQuestion() {

    currentQuestion++;
    questionLocked = false;

    questionNumber.textContent = `Question ${currentQuestion} of ${totalQuestions}`;
    feedback.textContent = "";
    feedback.className = "";
    answerInput.value = "";
    answerInput.disabled = false;
    submitButton.disabled = false;

    currentOperator = selectedOperators[randomInt(0, selectedOperators.length - 1)];
    const firstIsFraction = Math.random() < 0.5;

    currentFraction1 = generateFraction(firstIsFraction, rangeMinVal, rangeMaxVal);
    currentFraction2 = generateFraction(!firstIsFraction, rangeMinVal, rangeMaxVal);

    if (currentOperator === "/") {
        while (currentFraction2.num === 0) {
            currentFraction2 = generateFraction(!firstIsFraction, rangeMinVal, rangeMaxVal);
        }
    }

    if (currentOperator === "+") {
        expectedAnswer = currentFraction1.add(currentFraction2);
    } else if (currentOperator === "-") {
        expectedAnswer = currentFraction1.subtract(currentFraction2);
    } else if (currentOperator === "*") {
        expectedAnswer = currentFraction1.multiply(currentFraction2);
    } else {
        expectedAnswer = currentFraction1.divide(currentFraction2);
    }

    problem.innerHTML = `
        ${fractionHTML(currentFraction1)}
        <span class="operator">${currentOperator}</span>
        ${fractionHTML(currentFraction2)}
    `;

    answerInput.focus();
}


// ==========================================
// GENERATE EXPLANATION TEXT
// ==========================================

function buildExplanation(f1, f2, op, ans) {
    const a = f1.num, b = f1.den;
    const c = f2.num, d = f2.den;
    const formattedAns = ans.toString(allowMixedNumbers);

    if (op === "+") {
        const rawNum = a * d + c * b;
        const rawDen = b * d;
        let text = `Common Denominator: ${b} × ${d} = ${rawDen}.<br>`;
        text += `Adjust Numerators: (${a} × ${d}) + (${b} × ${c}) = ${rawNum}.<br>`;
        text += `Unsimplified Result: ${rawNum}/${rawDen}.`;
        if (ans.isSimplified()) {
            text += `<br>Final Simplified Answer: <strong>${formattedAns}</strong>`;
        }
        return text;
    }

    if (op === "-") {
        const rawNum = a * d - c * b;
        const rawDen = b * d;
        let text = `Common Denominator: ${b} × ${d} = ${rawDen}.<br>`;
        text += `Adjust Numerators: (${a} × ${d}) - (${b} × ${c}) = ${rawNum}.<br>`;
        text += `Unsimplified Result: ${rawNum}/${rawDen}.`;
        if (ans.isSimplified()) {
            text += `<br>Final Simplified Answer: <strong>${formattedAns}</strong>`;
        }
        return text;
    }

    if (op === "*") {
        const rawNum = a * c;
        const rawDen = b * d;
        let text = `Multiply Numerators: ${a} × ${c} = ${rawNum}.<br>`;
        text += `Multiply Denominators: ${b} × ${d} = ${rawDen}.<br>`;
        text += `Unsimplified Result: ${rawNum}/${rawDen}.`;
        if (ans.isSimplified()) {
            text += `<br>Final Simplified Answer: <strong>${formattedAns}</strong>`;
        }
        return text;
    }

    if (op === "/") {
        let text = `Reciprocal of second fraction: ${d}/${c}.<br>`;
        const rawNum = a * d;
        const rawDen = b * c;
        text += `Multiply: (${a}/${b}) × (${d}/${c}) = ${rawNum}/${rawDen}.`;
        if (ans.isSimplified()) {
            text += `<br>Final Simplified Answer: <strong>${formattedAns}</strong>`;
        }
        return text;
    }

    return "";
}


// ==========================================
// SUBMIT ANSWER BUTTON
// ==========================================

submitButton.addEventListener("click", checkAnswer);

function checkAnswer() {

    if (questionLocked) return;

    let isCorrect = false;
    let userRawInput = answerInput.value.trim() || "(No Answer)";

    try {
        const userAnswer = Fraction.parse(answerInput.value, false);

        questionLocked = true;
        answerInput.disabled = true;
        submitButton.disabled = true;

        const formattedExpected = expectedAnswer.toString(allowMixedNumbers);

        if (userAnswer.equals(expectedAnswer) && userAnswer.isSimplified()) {
            score++;
            isCorrect = true;
            feedback.textContent = "Correct!";
            feedback.className = "correct";
        } else if (userAnswer.equals(expectedAnswer)) {
            feedback.textContent =
                `Your answer has the correct value, but it is not simplified. ` +
                `The answer is ${formattedExpected}.`;
            feedback.className = "incorrect";
        } else {
            feedback.textContent =
                `Incorrect. The correct answer is ${formattedExpected}.`;
            feedback.className = "incorrect";
        }

    } catch (error) {
        questionLocked = true;
        answerInput.disabled = true;
        submitButton.disabled = true;

        feedback.textContent = allowMixedNumbers
            ? "Invalid format. Enter e.g. 3/4, 2, or 1 1/2."
            : "Invalid format. Enter e.g. 3/4 or 2.";
        feedback.className = "incorrect";
    }

    questionHistory.push({
        num: currentQuestion,
        f1: currentFraction1,
        f2: currentFraction2,
        op: currentOperator,
        expected: expectedAnswer,
        userAnswerText: userRawInput,
        correct: isCorrect,
        explanation: buildExplanation(currentFraction1, currentFraction2, currentOperator, expectedAnswer)
    });

    setTimeout(nextStep, 1500);
}


function nextStep() {
    if (currentQuestion < totalQuestions) {
        generateQuestion();
    } else {
        showResults();
    }
}


function showResults() {
    quizScreen.classList.add("hidden");
    resultsScreen.classList.remove("hidden");

    const percent = (score / totalQuestions) * 100;

    finalScore.textContent = `Final Score: ${score}/${totalQuestions}`;
    percentage.textContent = `Percentage: ${percent.toFixed(1)}%`;

    if (percent === 100) {
        resultMessage.textContent = "Outstanding! Perfect score.";
    } else if (percent >= 70) {
        resultMessage.textContent = "Great job! Keep practicing.";
    } else {
        resultMessage.textContent = "Good effort! A bit more practice will get you there.";
    }

    explanationsContainer.classList.add("hidden");
    toggleExplanationsBtn.textContent = "Show Explanations";
}


toggleExplanationsBtn.addEventListener("click", () => {
    if (explanationsContainer.classList.contains("hidden")) {
        renderExplanations();
        explanationsContainer.classList.remove("hidden");
        toggleExplanationsBtn.textContent = "Hide Explanations";
    } else {
        explanationsContainer.classList.add("hidden");
        toggleExplanationsBtn.textContent = "Show Explanations";
    }
});


function renderExplanations() {
    explanationsList.innerHTML = "";

    questionHistory.forEach((q) => {
        const item = document.createElement("div");
        item.className = `explanation-card ${q.correct ? "card-correct" : "card-incorrect"}`;

        const problemStr = `${q.f1.toString(allowMixedNumbers)} ${q.op} ${q.f2.toString(allowMixedNumbers)}`;
        const correctStr = q.expected.toString(allowMixedNumbers);

        item.innerHTML = `
            <div class="card-header">
                <strong>Q${q.num}: ${problemStr}</strong>
                <span class="status-badge">${q.correct ? "✓ Correct" : "✗ Incorrect"}</span>
            </div>
            <div class="card-details">
                <p><strong>Your Answer:</strong> ${q.userAnswerText}</p>
                <p><strong>Correct Answer:</strong> ${correctStr}</p>
                <div class="step-explanation">
                    <strong>Solution Steps:</strong>
                    <div class="steps-body">${q.explanation}</div>
                </div>
            </div>
        `;

        explanationsList.appendChild(item);
    });
}


restartButton.addEventListener("click", restartQuiz);

function restartQuiz() {
    resultsScreen.classList.add("hidden");
    startScreen.classList.remove("hidden");
    questionCount.focus();
}


answerInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        checkAnswer();
    }
});
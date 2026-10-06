// ==========================================
// Fraction Class
// ==========================================

class Fraction {

    constructor(numerator, denominator, simplify = true) {

        if (denominator === 0) {
            throw new Error("Denominator cannot be zero.");
        }

        // Move negative sign to numerator
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


    // Check if fraction is simplified
    isSimplified() {
        return gcd(
            Math.abs(this.num),
            this.den
        ) === 1;
    }


    // Check if fraction is a whole number
    isInteger() {
        return this.den === 1;
    }


    // Display fraction as a string
    toString() {

        if (this.den === 1) {
            return `${this.num}`;
        }

        return `${this.num}/${this.den}`;
    }


    // Compare two fractions
    equals(other) {

        if (typeof other === "number") {
            other = new Fraction(other, 1);
        }

        return (
            this.num === other.num &&
            this.den === other.den
        );
    }


    // Addition
    add(other) {

        const newNum =
            this.num * other.den +
            other.num * this.den;

        const newDen =
            this.den * other.den;

        return new Fraction(newNum, newDen);
    }


    // Subtraction
    subtract(other) {

        const newNum =
            this.num * other.den -
            other.num * this.den;

        const newDen =
            this.den * other.den;

        return new Fraction(newNum, newDen);
    }


    // Multiplication
    multiply(other) {

        const newNum =
            this.num * other.num;

        const newDen =
            this.den * other.den;

        return new Fraction(newNum, newDen);
    }


    // Division
    divide(other) {

        if (other.num === 0) {
            throw new Error("Cannot divide by zero.");
        }

        const newNum =
            this.num * other.den;

        const newDen =
            this.den * other.num;

        return new Fraction(newNum, newDen);
    }


    // Convert user input into a Fraction
    static parse(input, simplify = true) {

        input = input.trim();

        if (input.includes("/")) {

            const parts = input.split("/");

            if (parts.length !== 2) {
                throw new Error("Invalid format.");
            }

            const numerator = parseInt(parts[0]);
            const denominator = parseInt(parts[1]);

            if (
                isNaN(numerator) ||
                isNaN(denominator)
            ) {
                throw new Error("Invalid number.");
            }

            return new Fraction(
                numerator,
                denominator,
                simplify
            );
        }

        const number = parseInt(input);

        if (isNaN(number)) {
            throw new Error("Invalid number.");
        }

        return new Fraction(
            number,
            1,
            simplify
        );
    }
}


// ==========================================
// Greatest Common Divisor
// ==========================================

function gcd(a, b) {

    while (b !== 0) {

        const temp = b;

        b = a % b;

        a = temp;
    }

    return Math.abs(a);
}


// ==========================================
// Random Fraction Generator
// ==========================================

function generateFraction(
    minVal = -10,
    maxVal = 10,
    forceNonInteger = false
) {

    while (true) {

        const minDenominator =
            forceNonInteger ? 2 : 1;

        const denominator =
            randomInt(minDenominator, 10);

        const numerator =
            randomInt(minVal, maxVal);

        const fraction =
            new Fraction(numerator, denominator);


        if (
            forceNonInteger &&
            fraction.isInteger()
        ) {
            continue;
        }

        return fraction;
    }
}


// Generate random integer
function randomInt(min, max) {

    return Math.floor(
        Math.random() * (max - min + 1)
    ) + min;
}


// ==========================================
// Quiz Variables
// ==========================================

let currentQuestion = 0;
let totalQuestions = 0;
let score = 0;

let currentExpectedAnswer = null;


// ==========================================
// HTML Elements
// ==========================================

const startScreen =
    document.getElementById("start-screen");

const quizScreen =
    document.getElementById("quiz-screen");

const resultsScreen =
    document.getElementById("results-screen");

const questionCount =
    document.getElementById("question-count");

const startButton =
    document.getElementById("start-button");

const submitButton =
    document.getElementById("submit-button");

const restartButton =
    document.getElementById("restart-button");

const answerInput =
    document.getElementById("answer");

const problem =
    document.getElementById("problem");

const questionNumber =
    document.getElementById("question-number");

const feedback =
    document.getElementById("feedback");

const finalScore =
    document.getElementById("final-score");

const percentage =
    document.getElementById("percentage");

const resultMessage =
    document.getElementById("result-message");


// ==========================================
// Start Quiz
// ==========================================

startButton.addEventListener(
    "click",
    startQuiz
);


function startQuiz() {

    totalQuestions =
        parseInt(questionCount.value);

    if (
        isNaN(totalQuestions) ||
        totalQuestions <= 0
    ) {
        alert(
            "Please enter a positive number."
        );

        return;
    }

    currentQuestion = 0;
    score = 0;

    startScreen.classList.add("hidden");

    resultsScreen.classList.add("hidden");

    quizScreen.classList.remove("hidden");

    generateQuestion();
}


// ==========================================
// Generate Question
// ==========================================

function generateQuestion() {

    currentQuestion++;

    questionNumber.textContent =
        `Question ${currentQuestion} of ${totalQuestions}`;

    feedback.textContent = "";

    answerInput.value = "";

    answerInput.focus();


    const operators = [
        "+",
        "-",
        "*",
        "/"
    ];

    const operator =
        operators[
            randomInt(0, operators.length - 1)
        ];


    // Randomly decide which fraction
    // must be a non-integer
    const forceF1Fraction =
        Math.random() < 0.5;


    const f1 =
        generateFraction(
            -10,
            10,
            forceF1Fraction
        );


    let f2 =
        generateFraction(
            -10,
            10,
            !forceF1Fraction
        );


    // Prevent division by zero
    if (operator === "/") {

        while (f2.num === 0) {

            f2 =
                generateFraction(
                    -10,
                    10,
                    !forceF1Fraction
                );
        }
    }


    // Calculate answer
    let expected;


    if (operator === "+") {

        expected = f1.add(f2);

    } else if (operator === "-") {

        expected = f1.subtract(f2);

    } else if (operator === "*") {

        expected = f1.multiply(f2);

    } else {

        expected = f1.divide(f2);
    }


    currentExpectedAnswer = expected;


    // Parentheses around negative numbers
    const f1String =
        f1.num < 0
            ? `(${f1})`
            : f1.toString();


    const f2String =
        f2.num < 0
            ? `(${f2})`
            : f2.toString();


    problem.textContent =
        `${f1String} ${operator} ${f2String}`;
}


// ==========================================
// Submit Answer
// ==========================================

submitButton.addEventListener(
    "click",
    checkAnswer
);


function checkAnswer() {

    try {

        const userAnswer =
            Fraction.parse(
                answerInput.value,
                false
            );


        // Check value
        if (
            userAnswer.equals(
                currentExpectedAnswer
            )
        ) {

            // Check if simplified
            if (userAnswer.isSimplified()) {

                feedback.textContent =
                    "Correct!";

                feedback.className =
                    "correct";

                score++;

            } else {

                feedback.textContent =
                    `Incorrect. Your value was correct, ` +
                    `but it was not fully simplified. ` +
                    `The simplified answer is ` +
                    `${currentExpectedAnswer}.`;

                feedback.className =
                    "incorrect";
            }

        } else {

            feedback.textContent =
                `Incorrect. The correct answer was ` +
                `${currentExpectedAnswer}.`;

            feedback.className =
                "incorrect";
        }


        // Wait before moving to next question
        setTimeout(() => {

            if (
                currentQuestion < totalQuestions
            ) {

                generateQuestion();

            } else {

                showResults();
            }

        }, 1500);


    } catch (error) {

        feedback.textContent =
            "Invalid format. Please enter a fraction " +
            "(a/b) or an integer.";

        feedback.className =
            "incorrect";
    }
}


// ==========================================
// Show Results
// ==========================================

function showResults() {

    quizScreen.classList.add("hidden");

    resultsScreen.classList.remove("hidden");


    const percent =
        (score / totalQuestions) * 100;


    finalScore.textContent =
        `Final Score: ${score}/${totalQuestions}`;


    percentage.textContent =
        `Percentage: ${percent.toFixed(1)}%`;


    if (percent === 100) {

        resultMessage.textContent =
            "Outstanding! Perfect score.";

    } else if (percent >= 70) {

        resultMessage.textContent =
            "Great job! Keep practicing.";

    } else {

        resultMessage.textContent =
            "Good effort! A bit more practice will get you there.";
    }
}


// ==========================================
// Restart Quiz
// ==========================================

restartButton.addEventListener(
    "click",
    () => {

        resultsScreen.classList.add("hidden");

        startScreen.classList.remove("hidden");
    }
);
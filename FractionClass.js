// ==========================================
// FRACTION CLASS
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


        // Simplify the fraction
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


    // Convert fraction to text
    toString() {

        if (this.den === 1) {
            return String(this.num);
        }

        return `${this.num}/${this.den}`;
    }


    // Check if two fractions have the same value
    equals(other) {

        return (
            this.num === other.num &&
            this.den === other.den
        );
    }


    // Addition
    add(other) {

        const newNumerator =
            this.num * other.den +
            other.num * this.den;

        const newDenominator =
            this.den * other.den;

        return new Fraction(
            newNumerator,
            newDenominator
        );
    }


    // Subtraction
    subtract(other) {

        const newNumerator =
            this.num * other.den -
            other.num * this.den;

        const newDenominator =
            this.den * other.den;

        return new Fraction(
            newNumerator,
            newDenominator
        );
    }


    // Multiplication
    multiply(other) {

        const newNumerator =
            this.num * other.num;

        const newDenominator =
            this.den * other.den;

        return new Fraction(
            newNumerator,
            newDenominator
        );
    }


    // Division
    divide(other) {

        if (other.num === 0) {
            throw new Error(
                "Cannot divide by zero."
            );
        }

        const newNumerator =
            this.num * other.den;

        const newDenominator =
            this.den * other.num;

        return new Fraction(
            newNumerator,
            newDenominator
        );
    }


    // Convert user input into a Fraction
    static parse(input, simplify = true) {

        input = input.trim();


        // Example: 3/4
        if (input.includes("/")) {

            const parts = input.split("/");


            if (parts.length !== 2) {
                throw new Error(
                    "Invalid format."
                );
            }


            const numerator =
                Number(parts[0]);

            const denominator =
                Number(parts[1]);


            if (
                !Number.isInteger(numerator) ||
                !Number.isInteger(denominator)
            ) {
                throw new Error(
                    "Invalid number."
                );
            }


            return new Fraction(
                numerator,
                denominator,
                simplify
            );
        }


        // Example: 2
        const number = Number(input);


        if (!Number.isInteger(number)) {
            throw new Error(
                "Invalid number."
            );
        }


        return new Fraction(
            number,
            1,
            simplify
        );
    }
}


// ==========================================
// GREATEST COMMON DIVISOR
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
// RANDOM FRACTIONS
// ==========================================

function randomInt(min, max) {

    return Math.floor(
        Math.random() * (max - min + 1)
    ) + min;
}


function generateFraction(
    forceNonInteger = false
) {

    while (true) {

        const minDenominator =
            forceNonInteger ? 2 : 1;


        const denominator =
            randomInt(
                minDenominator,
                10
            );


        const numerator =
            randomInt(-10, 10);


        const fraction =
            new Fraction(
                numerator,
                denominator
            );


        // Make sure it isn't a whole number
        if (
            forceNonInteger &&
            fraction.isInteger()
        ) {
            continue;
        }


        return fraction;
    }
}


// ==========================================
// QUIZ VARIABLES
// ==========================================

let currentQuestion = 0;

let totalQuestions = 0;

let score = 0;

let expectedAnswer = null;

let questionLocked = false;


// ==========================================
// GET HTML ELEMENTS
// ==========================================

const startScreen =
    document.getElementById(
        "start-screen"
    );

const quizScreen =
    document.getElementById(
        "quiz-screen"
    );

const resultsScreen =
    document.getElementById(
        "results-screen"
    );


const questionCount =
    document.getElementById(
        "question-count"
    );


const startButton =
    document.getElementById(
        "start-button"
    );


const submitButton =
    document.getElementById(
        "submit-button"
    );


const restartButton =
    document.getElementById(
        "restart-button"
    );


const answerInput =
    document.getElementById(
        "answer"
    );


const problem =
    document.getElementById(
        "problem"
    );


const questionNumber =
    document.getElementById(
        "question-number"
    );


const feedback =
    document.getElementById(
        "feedback"
    );


const finalScore =
    document.getElementById(
        "final-score"
    );


const percentage =
    document.getElementById(
        "percentage"
    );


const resultMessage =
    document.getElementById(
        "result-message"
    );


// ==========================================
// START QUIZ BUTTON
// ==========================================

startButton.addEventListener(
    "click",
    startQuiz
);


function startQuiz() {

    const number =
        Number(questionCount.value);


    // Validate number of questions
    if (
        !Number.isInteger(number) ||
        number < 1 ||
        number > 50
    ) {

        alert(
            "Please enter a number between 1 and 50."
        );

        return;
    }


    totalQuestions = number;

    currentQuestion = 0;

    score = 0;


    // Hide start screen
    startScreen.classList.add(
        "hidden"
    );


    // Show quiz
    quizScreen.classList.remove(
        "hidden"
    );


    // Create first question
    generateQuestion();
}

function fractionHTML(fraction) {
    return `
        <span class="fraction">
            <span class="numerator">${fraction.numerator}</span>
            <span class="denominator">${fraction.denominator}</span>
        </span>
    `;
}

// ==========================================
// GENERATE QUESTION
// ==========================================

function generateQuestion() {

    currentQuestion++;

    questionLocked = false;

    questionNumber.textContent =
        `Question ${currentQuestion} of ${totalQuestions}`;

    feedback.textContent = "";

    feedback.className = "";

    answerInput.value = "";

    answerInput.disabled = false;

    submitButton.disabled = false;


    const operators = [
        "+",
        "-",
        "*",
        "/"
    ];


    // Choose random operator
    const operator =
        operators[
            randomInt(
                0,
                operators.length - 1
            )
        ];


    // Decide which fraction must be a fraction
    const firstIsFraction =
        Math.random() < 0.5;


    const fraction1 =
        generateFraction(
            firstIsFraction
        );


    let fraction2 =
        generateFraction(
            !firstIsFraction
        );


    // Don't divide by zero
    if (operator === "/") {

        while (fraction2.num === 0) {

            fraction2 =
                generateFraction(
                    !firstIsFraction
                );
        }
    }


    // Calculate correct answer
    if (operator === "+") {

        expectedAnswer =
            fraction1.add(fraction2);

    } else if (operator === "-") {

        expectedAnswer =
            fraction1.subtract(
                fraction2
            );

    } else if (operator === "*") {

        expectedAnswer =
            fraction1.multiply(
                fraction2
            );

    } else {

        expectedAnswer =
            fraction1.divide(
                fraction2
            );
    }


    // Display problem
    problem.innerHTML = `
        ${fractionHTML(fraction1)}
        <span class="operator">${operator}</span>
        ${fractionHTML(fraction2)}
    `;

    answerInput.focus();
}


// ==========================================
// SUBMIT ANSWER BUTTON
// ==========================================

submitButton.addEventListener(
    "click",
    checkAnswer
);


function checkAnswer() {

    // Don't allow multiple submissions
    if (questionLocked) {
        return;
    }


    try {

        // Read user's answer
        const userAnswer =
            Fraction.parse(
                answerInput.value,
                false
            );


        questionLocked = true;


        answerInput.disabled = true;

        submitButton.disabled = true;


        // Correct AND simplified
        if (
            userAnswer.equals(
                expectedAnswer
            ) &&
            userAnswer.isSimplified()
        ) {

            score++;


            feedback.textContent =
                "Correct!";


            feedback.className =
                "correct";


        // Correct value but not simplified
        } else if (
            userAnswer.equals(
                expectedAnswer
            )
        ) {

            feedback.textContent =
                `Your answer has the correct value, ` +
                `but it is not simplified. ` +
                `The answer is ${expectedAnswer}.`;


            feedback.className =
                "incorrect";


        // Completely incorrect
        } else {

            feedback.textContent =
                `Incorrect. The correct answer ` +
                `is ${expectedAnswer}.`;


            feedback.className =
                "incorrect";
        }


        // Wait 1.5 seconds
        // before next question
        setTimeout(
            nextStep,
            1500
        );


    } catch (error) {

        // Invalid input
        feedback.textContent =
            "Invalid format. Enter something like 3/4 or 2.";

        feedback.className =
            "incorrect";
    }
}


// ==========================================
// NEXT QUESTION OR RESULTS
// ==========================================

function nextStep() {

    if (
        currentQuestion <
        totalQuestions
    ) {

        generateQuestion();

    } else {

        showResults();
    }
}


// ==========================================
// RESULTS
// ==========================================

function showResults() {

    quizScreen.classList.add(
        "hidden"
    );


    resultsScreen.classList.remove(
        "hidden"
    );


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
// TRY AGAIN BUTTON
// ==========================================

restartButton.addEventListener(
    "click",
    restartQuiz
);


function restartQuiz() {

    // Hide results
    resultsScreen.classList.add(
        "hidden"
    );


    // Show start screen
    startScreen.classList.remove(
        "hidden"
    );


    questionCount.focus();
}


// ==========================================
// PRESS ENTER TO SUBMIT
// ==========================================

answerInput.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Enter") {

            checkAnswer();
        }
    }
);


// Press Enter to start quiz
questionCount.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Enter") {

            startQuiz();
        }
    }
);
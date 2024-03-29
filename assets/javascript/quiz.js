let questionData = {};
let questionIndex = 0;
let score = 0;
let selectedDifficulty = "easy";
const visiblePostRefs = Array.from(document.querySelectorAll(".visible-post-fetch"));
const invisiblePostRefs = Array.from(document.querySelectorAll(".invisible-post-fetch"));

const difficultyDropdownRef = document.querySelector("#difficulty-dropdown");
difficultyDropdownRef.addEventListener("change", function () {
	storeSelectedDifficulty(difficultyDropdownRef);
});

const startButtonRef = document.querySelector("#start-button");
startButtonRef.addEventListener("click", function () {
	getQuestions();
});

const answerButtonsRefs = Array.from(document.querySelectorAll(".answer-button"));
answerButtonsRefs.forEach(button => {
	button.addEventListener("click", function () {
		submitAnswer(button);
	});
});

function storeSelectedDifficulty(element) {
	selectedDifficulty = element.value.toLowerCase();
}

/**
 * Request and display trivia data.
 * @param {string} questionDifficulty The user's selected difficulty level.
 */
async function getQuestions() {
	questionData = await requestData(selectedDifficulty);
	parseQuestionDetails();
	for (let element of visiblePostRefs) {
		element.style.visibility = "visible";
		element.style.display = "block";
	}
	for (let element of invisiblePostRefs) {
		element.style.visibility = "hidden";
		element.style.display = "none";
	}

}

/**
 * Make a fetch request for quiz trivia data.
 * @param {string} questionDifficulty The user's selected difficulty level.
 * @returns {object} Quiz trivia data.
 */
async function requestData(questionDifficulty) {
	const url = `https://opentdb.com/api.php?amount=10&category=17&difficulty=${questionDifficulty}&type=multiple`;
	return await fetch(url)
		.then((response) => response.json())
		.then((data) => {
			return data;
		})
		.catch((error) => {
			return null;
		});
}

/**
 * Format and display API data in question and answers.
 */
function parseQuestionDetails() {
	const questionDetail = questionData.results[questionIndex];
	let question = he.decode(questionDetail.question);

	document.getElementById("question-text").innerText = question;

	const answerChoices = Array.from(questionDetail.incorrect_answers);
	answerChoices.push(questionDetail.correct_answer);

	const choiceElements = document.getElementsByClassName("answer-button");
	for (let choiceElement of choiceElements) {
		// Select random answer from answer choices
		const randomAnswer =
			answerChoices[Math.floor(Math.random() * answerChoices.length)];
		choiceElement.innerText = he.decode(randomAnswer);

		const randomAnswerIndex = answerChoices.indexOf(randomAnswer);
		// Remove previously selected answer choice from array
		answerChoices.splice(randomAnswerIndex, 1);
	}
}

/**
 * Display question number that the user is currently on.
 */
function updateQuestionCounterDOM() {
	document.getElementById("question-counter").innerText = `Question ${questionIndex + 1}/10`;
}

/**
 * Check user's submitted answer, track score and prompt for next question/end quiz. 
 */
function submitAnswer(element) {
	if (
		element.innerText == he.decode(questionData.results[questionIndex].correct_answer)
	) {
		score += 1;
	}
	questionIndex += 1;
	if (questionIndex < questionData.results.length) {
		parseQuestionDetails();
		updateQuestionCounterDOM();
	} else {
		showScore();
	}
}

/**
 * Display user's final score.
 */
function showScore() {
	document.getElementById(
		"score-display"
	).innerText = `Your score is ${score}!`;

	const playAgainButton = document.getElementById("play-again");
	playAgainButton.addEventListener("click", function () {
		location.reload();
	});

	document.getElementById("score-modal").style.display = "flex";
}
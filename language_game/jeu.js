var posQuestion = 0;
var goodAnswers = 0;

/**
 * Gets the id of the current URL of the page
 */
function getUrlId() {
    let url_String = window.location.href;
    let url = new URL(url_String);
    let urlId = url.searchParams.get('quizId');
    return urlId;
}

/**
 * Sets the position of the data, based on the selection, returns it and displays the theme and the question
 */
function setFoundDataPosAndDisplayThemeAndQuestion() {

    let id = getUrlId();
    let foundDataPos = getDataPosById(id);
    let posQuestion = setAndDisplayQuestionNb();
    let quizOnTheme = 'Quiz sur le thème : ';

    document.getElementById('chosentheme').innerHTML = quizOnTheme + data[foundDataPos].description;
    document.getElementById('question').innerHTML = data[foundDataPos].questions[posQuestion].question;

    return foundDataPos;
}

/**
 * Gets the position of the data by its id
 * 
 * @param {*} id given id to search in the data file
 */
function getDataPosById(id) {
    let dataPos = 0;
    let id2 = "";
    let i = 0;
    data.forEach(element => {
        id2 = element.id;
        if (id == id2) {
            dataPos = i;
        }
        i++;
    });
    return dataPos;
}

/**
 * Sets, displays and returns the number of the current question
 */
function setAndDisplayQuestionNb() {
    let nbQuestion = posQuestion + 1;
    document.getElementById('questiontitle').innerHTML = 'Question ' + nbQuestion + ' :';
    return posQuestion;
}

/**
 * Splits the available answers (words) , shuffles them and create buttons with them 
 */
function createShuffledAnswerButtons() {

    let dataPos = setFoundDataPosAndDisplayThemeAndQuestion();
    let posQuestion = setAndDisplayQuestionNb();
    let words = data[dataPos].questions[posQuestion].answer + ' ' + data[dataPos].questions[posQuestion].extras;
    let wordsArray = words.split(' ');
    let className = 'stockWords';

    shuffle(wordsArray);
    let nb = 0;
    wordsArray.forEach(element => {
        let idStr = 'avWord' + (nb) + '';
        $('.availableWords').append('<button class=' + className + ' id=' + idStr + '>' + element + '</button>');
        nb++;
    });

    //Prevent the page to be refreshed and calls moveToAnswer when a button is clicked
    $('.availableWords').off('click');
    $('.availableWords').click(function (event) {
        event.preventDefault();
        moveToAnswer(event);
    });

    //Prevent the page to be refreshed and calls removeFromAnswer when a button is clicked
    $('.answerWords').off('click');
    $('.answerWords').click(function (event) {
        event.preventDefault();
        removeFromAnswer(event);
    });

    //Prevent the page to be refreshed and calls verificationButton when its button is clicked
    $('.button').off('click');
    $('.button').click(function (event) {
        event.preventDefault();
        verificationButton(event);
    });

    //Hides the unecessary buttons (for the moment)
    $('.nextbutton').hide();
    $('.retryQuiz').hide();
    $('.otherQuiz').hide();

}

/**
 * Shuffle the array.
 * @param {∗[]} array
 */

function shuffle(array) {
    let counter = array.length;
    while (counter > 0) {
        let index = Math.floor(Math.random() * counter);
        counter--;
        // Swap positions counter and index in the array.
        [array[counter], array[index]] = [array[index], array[counter]];
    }
}

/**
 * Appends the class answerWords.
 * 
 * @param {*} event when a button is clicked
 */
function moveToAnswer(event) {
    if (event && event.target && (event.target.className == 'stockWords')) {
        $('.answerWords').append(event.target);
    }
}

/**
 * Appends the class availableWords.
 * 
 * @param {*} event when a button is clicked
 */
function removeFromAnswer(event) {
    if (event && event.target && (event.target.className == 'stockWords')) {
        $('.availableWords').append(event.target);
    }
}

/**
 * Button that checks if the user's answer is correct or not, hides itself and disables
 * the clicks of the clickable words.
 * 
 * @param {*} event 
 */
function verificationButton(event) {

    if (event && event.target && (event.target.className == 'button')) {
        let answerResult = document.getElementsByClassName('answerWords');
        let finalAnswer = '';
        for (let i = 0; i < answerResult.length; i++) {
            finalAnswer = answerResult[i].innerText;
        }

        let dataPos = setFoundDataPosAndDisplayThemeAndQuestion();
        let posQuestion = setAndDisplayQuestionNb();
        let words = data[dataPos].questions[posQuestion].answer;
        let wordsWithoutSpaces = words.split(' ').join('');

        if (finalAnswer == wordsWithoutSpaces) {
            $('.goodresult').append("<span id=result>Bravo !</span>");
            goodAnswers++;
        }
        else {
            $('.badresult').append("<span id=result>" + words + "</span>");
        }
        $('.button').hide();
        disableButton();
        if ((posQuestion + 1) < getNumberOfQuestions()) {
            nextQuestion();
        }
        else {
            reachedEndQuestions();
        }

    }

}

/**
 * Disables the clicks of the words and prevent a refresh of the page
 */
function disableButton() {

    $('.availableWords').off('click');
    $('.answerWords').off('click');

    $('.availableWords').click(function (event) {
        event.preventDefault();
    });

    $('.answerWords').click(function (event) {
        event.preventDefault();
    });

}

/**
 * Button to go to the next question
 */
function nextQuestion() {
    $('.nextbutton').show();
    $('.nextbutton').off('click');
    $('.nextbutton').click(function (event) {
        event.preventDefault();
        posQuestion++;
        $('#result').remove();
        $('.stockWords').remove();
        $('.nextbutton').hide();
        createShuffledAnswerButtons();
        $('.button').show();
    });
}

/**
 * Displays two buttons leaving the user the choice to retry the same quiz or choose an other quiz
 */
function reachedEndQuestions() {

    $('.retryQuiz').show();
    $('.otherQuiz').show();

    displayGoodAnswers();

    $('.retryQuiz').click(function (event) {
        event.preventDefault();
        posQuestion = 0;
        goodAnswers = 0;
        $('.retryQuiz').hide();
        $('.otherQuiz').hide();
        $('#result').remove();
        $('#endResult').remove();
        $('.stockWords').remove();
        createShuffledAnswerButtons();
        $('.button').show();
    });

    $('.otherQuiz').click(function (event) {
        event.preventDefault();
        window.location.replace("index.html");
    });
}

/**
 * Gets the total number of questions in the quiz
 */
function getNumberOfQuestions() {
    let dataPos = setFoundDataPosAndDisplayThemeAndQuestion();
    return data[dataPos].questions.length;
}

/**
 * Displays the total number of good answers.
 */
function displayGoodAnswers() {
    $('.endResult').append("<span id=endResult>Fin du quiz : " + goodAnswers + " bonnes réponse(s) sur " + getNumberOfQuestions() + " au total." + "</span>");
}
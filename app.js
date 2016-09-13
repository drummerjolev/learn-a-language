// APP

// TODO:
// sign in with google
// sign in error handling
// question screens
// result screen with share on Facebook/Twitter

// GLOBAL VARS
// Your Client ID can be retrieved from your project in the Google
// Developer Console, https://console.developers.google.com
var CLIENT_ID = '631449151717-7j05jg0ub3cmh84l2o5qda6uom1qimhv.apps.googleusercontent.com';
var SCOPES = ["https://www.googleapis.com/auth/spreadsheets.readonly"];
var LOADING_CONTAINER = "body";
var WORDS = []; // array of arrays

// INIT
init();

function init() {
  $(LOADING_CONTAINER).loadie();
}

function displayPreviousRoundScore() {
  var maxScore = extractUrlParameter(window.location.href,'maxscore');
  var currentScore = extractUrlParameter(window.location.href,'score');
  var percentageScore = ((currentScore / maxScore) * 100).toFixed(1) + "%";

  // TODO: handle NaN case

  if (maxScore && currentScore) {
    $("div.result-container h1").text(percentageScore);
    $("div.result-container").fadeIn('600');

    $(".BTN-NEW-ROUND").on('click', function(event) {
      window.location.replace(removeUrlParameters(window.location.href));
    });

    return true;
  } else {
    $("div.welcome-container").fadeIn('600');
    return false;
  }
}

/**
 * Check if current user has authorized this application.
 */
function checkAuth() {
  if (!displayPreviousRoundScore()) {
    gapi.auth.authorize(
      {
        'client_id': CLIENT_ID,
        'scope': SCOPES.join(' '),
        'immediate': true
      }, handleAuthResult);
    $(LOADING_CONTAINER).loadie(0.3);
  }
}

/**
 * Handle response from authorization server.
 *
 * @param {Object} authResult Authorization result.
 */
function handleAuthResult(authResult) {
  var authorizeDiv = document.getElementById('authorize-div');
  if (authResult && !authResult.error) {
    // Hide auth UI, then load client library.
    authorizeDiv.style.display = 'none';
    $(LOADING_CONTAINER).loadie(0.6);
    loadSheetsApi();
  } else {
    // Show auth UI, allowing the user to initiate authorization by
    // clicking authorize button.
    authorizeDiv.style.display = 'inline';
  }
}

/**
 * Initiate auth flow in response to user clicking authorize button.
 *
 * @param {Event} event Button click event.
 */
function handleAuthClick(event) {
  gapi.auth.authorize(
    {client_id: CLIENT_ID, scope: SCOPES, immediate: false},
    handleAuthResult);
  return false;
}

/**
 * Load Sheets API client library.
 */
function loadSheetsApi() {
  var discoveryUrl =
      'https://sheets.googleapis.com/$discovery/rest?version=v4';
  gapi.client.load(discoveryUrl).then(getWordsFromSheet);
}

/**
 * Print the names and majors of students in a sample spreadsheet:
 * https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 */
function getWordsFromSheet() {
  $(LOADING_CONTAINER).loadie(0.8);
  gapi.client.sheets.spreadsheets.values.get({
    // published spreadsheet unique id
    spreadsheetId: '1Ps7HwpTyppwDpnar4PW64iR3N87FRkl0YDkhLGLXVjw',

    // get all content from 2 first columns starting from second row
    // so it doesn't include headings
    range: 'Words List!A2:B',

  }).then(function(response) {
    var range = response.result;
    if (range.values.length > 0) {
      // save words to global variable
      WORDS = range.values;

      $(LOADING_CONTAINER).loadie(1);
      $(".BTN-START").fadeIn("slow");
      bindAfterLoad();
    } else {
      // TODO
      $(LOADING_CONTAINER).loadie(0.1);
    }
  }, function(response) {
    $(LOADING_CONTAINER).loadie(0.1);
    // TODO
  });
}

/**
 * Append a pre element to the body containing the given message
 * as its text node.
 *
 * @param {string} message Text to be placed in pre element.
 */
function appendPre(message) {
  var pre = document.getElementById('output');
  var textContent = document.createTextNode(message + '\n');
  pre.appendChild(textContent);
}

/* EVENT LISTENERS, bound after successful API response
*/
function bindAfterLoad() {
  $(document).ready(function() {
    // button click
    $(".BTN-START").on("click", function(event) {
      // welcome fades out, callback launches app
      $("section.welcome").fadeOut(700, "easeOutQuad", function() {
        handleQuizRound();
      });
    });
  });
}

// render question
// handle points on response
// destroy question and render next on success

function handleQuizRound() {
  var currentQuiz = getQuiz(10);
  var quizLength = currentQuiz.length;
  var globalScore = 0;

  $("section.main").show();
  loadCurrentQuiz(currentQuiz);

  for (var i = 0; i < quizLength; i++) {
  }

}

function setQuizObject(originalWord,translatedWord,wrongTranslatedWords) {
  var quizObject = {
    word: originalWord,
    translation: translatedWord,
    wrongTranslations: wrongTranslatedWords,
    score: 0
  }
  return quizObject;
}

function getQuiz(quizLength) {
  // logic requires at least 3 words to display: 1 correct choice, 2 wrong choices
  if (WORDS.length < 3) {
    return null;  
  }

  if (quizLength > WORDS.length) {
    quizLength = WORDS.length
  }
  
  // type: [QuizObject]
  var quizContainer = []
  // work with copy of WORDS
  var wordsToShuffle = WORDS
  shuffleArray(wordsToShuffle);

  for (var i = 0; i < quizLength; i++) {
    // contains random (wrong) choices, type [Int]
    var wrongChoicesContainer = []
    while(wrongChoicesContainer.length < 2) {
      var randomNumber = Math.floor(Math.random() * WORDS.length);
      if (randomNumber != i && !arrayContains(wrongChoicesContainer,wordsToShuffle[randomNumber][1])) {
        wrongChoicesContainer.push(wordsToShuffle[randomNumber][1]);
      }
    }
    var currentQuizObject = setQuizObject(wordsToShuffle[i][0],wordsToShuffle[i][1],wrongChoicesContainer);
    quizContainer.push(currentQuizObject);
  }
  return quizContainer;
}
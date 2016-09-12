(function() {

    // API: used by app.js
    window.loadCurrentQuiz = loadCurrentQuiz;

    function flashHtmlElement(backgroundElement) {
        var flasher = $(backgroundElement);
        flasher.fadeIn(50, function() {
            flasher.fadeOut(300, function() {
            });
        });
    }

    function loadCurrentQuiz(quiz,counter) {
        // TODO: add case for empty quiz

        // init counter to 0 if called for the first time
        if (counter == null) {
            counter = 0;
        }

        // current score init to max (3), wrong choices modify number
        var currentWordScore = 3;

        // handle response choice from user input
        var handleClick = function (a) {
            if (a === quiz[counter].translation) {
                quiz[counter].score = currentWordScore;
            } else {
                flashHtmlElement(".fullscreen-flasher");
                if (currentWordScore > 0) {
                    currentWordScore--;
                }
            }
        }
        
        // set original word
        var originalWordContainer = $("section.main div.questionContainer div.originalWord")[0];
        var Question = React.createClass({
            render: function() {
                return (
                <h1>{this.props.word}</h1>
                );
            }
        });
        ReactDOM.render(<Question word={quiz[counter].word} />, originalWordContainer);

        // set response choices
        var responseWordContainer = $("section.main div.questionContainer div.responseChoices")[0];
        var Responses = React.createClass({
            render: function() {
                var currentItem = 0;
                var createResponseItem = function (item) {
                    return <li onClick={handleClick.bind(this,item)} key={currentItem++}><h2>{item}</h2></li>;
                };
                return <ul>{this.props.items.map(createResponseItem)}</ul>
            }
        });

        // recreate array of wrong choices + correct choice
        var wordsToDisplay = quiz[counter].wrongTranslations;
        wordsToDisplay.push(quiz[counter].translation);
        shuffleArray(wordsToDisplay);

        ReactDOM.render(<Responses items={wordsToDisplay} />, responseWordContainer);
    }

}) ();// React Helper functions used by app.js
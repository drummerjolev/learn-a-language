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

        // recreate array of wrong choices + correct choice
        var wordsToDisplay = quiz[counter].wrongTranslations;
        wordsToDisplay.push(quiz[counter].translation);
        shuffleArray(wordsToDisplay);

        // React Components
        // Parent node at the bottom, children nodes need to be declared first
        var OriginalWord = React.createClass({
            render: function() {
                return (
                <h1>{this.props.word}</h1>
                );
            }
        });

        var Responses = React.createClass({
            render: function() {
                var currentItem = 0;
                var createResponseItem = function (item) {
                    return <li onClick={handleClick.bind(this,item)} key={currentItem++}><h2>{item}</h2></li>;
                };
                return <ul>{this.props.items.map(createResponseItem)}</ul>
            }
        });

        // controls children: the original word and the response choices.
        var Question = React.createClass({
            render: function() {
                return (
                    <div>
                        <div className="originalWord">
                            <OriginalWord word={this.props.quizOriginalWord} />
                        </div>
                        <div className="responseChoices">
                            <Responses items={this.props.quizItems} />
                        </div>
                    </div>
                );
            }
        });

        // render all React components
        var questionContainer = $("section.main div.questionContainer")[0];
        ReactDOM.render(<Question quizOriginalWord={quiz[counter].word} quizItems={wordsToDisplay} />, questionContainer);
    }

}) ();// React Helper functions used by app.js
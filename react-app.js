(function() {

    // API: used by app.js
    window.loadCurrentQuiz = loadCurrentQuiz;

    function loadCurrentQuiz(quiz) {
        // TODO: add case for empty quiz

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
                var handleResponse = this.props.handleResponse;
                var createResponseItem = function (item) {
                    return <li onClick={handleResponse.bind(null,item)} key={currentItem++}><h2>{item}</h2></li>;
                };
                return <ul>{this.props.items.map(createResponseItem)}</ul>
            }
        });

        // controls children: the original word and the response choices.
        var Question = React.createClass({

            getInitialState: function() {
                return { counter: 0 };
            },

            getCurrentResponseChoices: function() {
                var currentWord = quiz[this.state.counter];
                var wordsToDisplay = currentWord.wrongTranslations;
                wordsToDisplay.push(currentWord.translation);
                return shuffleArray(wordsToDisplay);
            },

            handleStateChange: function() {
                if (this.state.counter < quiz.length - 1) {
                    this.setState(function(previousState) {
                        return { counter: previousState.counter + 1};
                    });
                } else {
                    var finalScore = 0;
                    for (var i = 0; i < quiz.length; i++) {
                        finalScore += quiz[i].score;
                    }
                    // redirect to home page with parameters
                    window.location.replace(window.location.href + "?score=" + finalScore + "&maxScore=" + quiz.length*3);
                }
            },

            // handle response choice from user input
            handleClick: function (response) {
                var currentWord = quiz[this.state.counter];
                // scores are hard coded (max. 3, min. 1)
                if (response === currentWord.translation) {
                    if (currentWord.score <= 0) {
                        currentWord.score += 3;
                        this.handleStateChange();
                    }
                } else {
                    flashHtmlElement(".fullscreen-flasher");
                    if (currentWord.score > -2) {
                        currentWord.score--;
                    }
                }
            },

            render: function() {
                return (
                    <div>
                        <div className="originalWord">
                            <OriginalWord word={quiz[this.state.counter].word} />
                        </div>
                        <div className="responseChoices">
                            <Responses handleResponse={this.handleClick} items={this.getCurrentResponseChoices()} />
                        </div>
                    </div>
                );
            }
        });

        // render all React components
        var questionContainer = $("section.main div.questionContainer")[0];
        ReactDOM.render(<Question />, questionContainer);
    }

}) ();// React Helper functions used by app.js
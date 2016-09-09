(function() {

    // API: used by app.js
    window.loadCurrentQuiz = loadCurrentQuiz;

    function loadCurrentQuiz(quiz,counter) {
        // init counter to 0 if called for the first time
        if (counter == null) {
            counter = 0;
        }
        console.log(quiz);
        
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

        var handleClick = function (a) {
            console.log(a);
        }

        // set response choices
        var responseWordContainer = $("section.main div.questionContainer ul.responseChoices")[0];
        var correctResponse = React.createClass({
            render: function() {
                return (
                <li onClick={handleClick.bind(this,this.props.correctAnswer)}><h2>{this.props.correctAnswer}</h2></li>
                );
            }
        });
        ReactDOM.render(<correctResponse correctAnswer={quiz[counter].translation} />, responseWordContainer);
    }

}) ();// React Helper functions used by app.js
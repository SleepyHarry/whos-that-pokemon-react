import React, {Component} from "react";
import PropTypes from "prop-types";
import Pokemon from "./Pokemon";
import colours from "./colours";
import Score from "./Score";


class GuessHistory extends Component {
    shouldComponentUpdate(nextProps, nextState) {
        return this.props.guesses.length !== nextProps.guesses.length;
    }

    render() {
        return <div style={{width: "100%"}}>
            {this.props.guesses.slice(0, 10).map(guess =>
                <div key={guess.pokemon.id} className="guess-history-element">
                    <Pokemon {...guess.pokemon}/>
                    <div>
                        <span
                            style={{
                                display: "inline",
                                color: guess.correct ? colours.green : guess.close ? colours.amber : colours.red,
                            }}
                        >
                            <Score score={guess.points} length={5}>
                                {guess.points}
                            </Score>
                        </span>
                    </div>
                </div>
            )}
        </div>
    }
}

GuessHistory.propTypes = {
    guesses: PropTypes.array.isRequired,
};

export default GuessHistory;
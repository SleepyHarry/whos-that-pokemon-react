import React, {Component} from "react";
import PropTypes from "prop-types";
import {Button} from "react-bootstrap";


class StartScreen extends Component {
    render() {
        return <div>
            <h1>Who's that Pokémon?</h1>
            {this.props.lastScore &&
                <h3>{this.props.lastScore.initials} (Gen {this.props.lastScore.generation}): {this.props.lastScore.points}</h3>
            }
            <Button onClick={() => {this.props.goToScreen(this.props.screens.GEN_CHOOSE)}}>START</Button>
        </div>
    }
}

StartScreen.propTypes = {
    goToScreen: PropTypes.func.isRequired,
    screens: PropTypes.object.isRequired,

    lastScore: PropTypes.shape({
        initials: PropTypes.string,
        points: PropTypes.number,
        generation: PropTypes.number,
    }),
};

StartScreen.defaultProps = {
    lastScore: null,
};

export default StartScreen;
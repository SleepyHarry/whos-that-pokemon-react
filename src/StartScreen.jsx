import React, {Component} from "react";
import PropTypes from "prop-types";
import {Button} from "react-bootstrap";


class StartScreen extends Component {
    render() {
        return <div>
            <h1>Who's that Pokémon?</h1>
            <Button onClick={() => {this.props.goToScreen(this.props.screens.GEN_CHOOSE)}}>START</Button>
        </div>
    }
}

StartScreen.propTypes = {
    goToScreen: PropTypes.func.isRequired,
    screens: PropTypes.object.isRequired,
};

export default StartScreen;
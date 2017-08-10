import React, {Component} from "react";
import PropTypes from "prop-types";
import {Col, Row} from "react-bootstrap";
import WtpTitle from "./WtpTitle";
import ArcadeButton from "./ArcadeButton";


class InstructionsScreen extends Component {
    render() {
        return <div>
            <WtpTitle/>
            <Row>
                <Col className="centre-content">
                    The way you play this game is you have 60 seconds to guess the names of as many Pokémon as you can, going only by their sillhouettes.

                    A correct guess will earn you points based on how quickly you answer, but there are also points for accuracy! If you are almost correct (for example guessing "Pikchu" instead of "Pikachu"), you will only earn half of what you would have got with a correctly spelled answer.

                    Wrong answers do not penalise you, but you will get zero points. You can effectively skip a Pokémon you don't know by simply hitting enter or pressing "Guess", but not entering any text.

                    When the 60 seconds are up, you'll get a score and be asked to give your initials for the leaderboard.

                    Each generation has its own leaderboard. Can you be top ten in every generation?
                </Col>
            </Row>
            <Row>
                <Col xs={6}>
                    <ArcadeButton
                        onClick={() => {this.props.goToScreen(this.props.screens.START)}}
                    >
                        BACK
                    </ArcadeButton>
                </Col>
                <Col xs={6}>
                    <ArcadeButton
                        onClick={() => {this.props.goToScreen(this.props.screens.GEN_CHOOSE)}}
                    >
                        START
                    </ArcadeButton>
                </Col>
            </Row>
        </div>
    }
}

InstructionsScreen.propTypes = {
    goToScreen: PropTypes.func.isRequired,
    screens: PropTypes.object.isRequired,
};

export default InstructionsScreen;
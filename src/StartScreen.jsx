import React, {Component} from "react";
import PropTypes from "prop-types";
import {Col, Row} from "react-bootstrap";
import Leaderboard from "./Leaderboard";
import WtpTitle from "./WtpTitle";
import ArcadeButton from "./ArcadeButton";


class StartScreen extends Component {
    render() {
        return <div>
            <WtpTitle/>
            <Row>
                <Col xs={8} className="centre-content main-content">
                    <ArcadeButton
                        className="start-button"
                        onClick={() => {this.props.goToScreen(this.props.screens.GEN_CHOOSE)}}
                    >
                        START
                    </ArcadeButton>
                    <ArcadeButton
                        className="instructions-button"
                        onClick={() => {this.props.goToScreen(this.props.screens.INSTRUCTIONS)}}
                    >
                        HOW TO PLAY
                    </ArcadeButton>
                </Col>
                <Col xs={4}>
                    <Leaderboard
                        leaderboard={this.props.leaderboard}
                        lastScore={this.props.lastScore}
                    />
                </Col>
            </Row>
        </div>
    }
}

StartScreen.propTypes = {
    goToScreen: PropTypes.func.isRequired,
    screens: PropTypes.object.isRequired,

    lastScore: PropTypes.shape({
        id: PropTypes.number,
        initials: PropTypes.string,
        points: PropTypes.number,
        generation: PropTypes.number,
    }),
    leaderboard: PropTypes.array.isRequired,
};

StartScreen.defaultProps = {
    lastScore: null,
};

export default StartScreen;
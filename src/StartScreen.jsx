import React, {Component} from "react";
import PropTypes from "prop-types";
import {Button, Col, Row} from "react-bootstrap";
import Leaderboard from "./Leaderboard";
import WtpTitle from "./WtpTitle";


class StartScreen extends Component {
    render() {
        return <div>
            <WtpTitle/>
            <Row>
                <Col xs={9}>
                    <Button onClick={() => {this.props.goToScreen(this.props.screens.GEN_CHOOSE)}}>START</Button>
                </Col>
                <Col xs={3}>
                    <Leaderboard leaderboard={this.props.leaderboard}/>
                </Col>
            </Row>
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
    leaderboard: PropTypes.array.isRequired,
};

StartScreen.defaultProps = {
    lastScore: null,
};

export default StartScreen;
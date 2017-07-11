import React, {Component} from "react";
import PropTypes from "prop-types";
import {Button, Col, FormControl, FormGroup, Row} from "react-bootstrap";
import Pokemon from "./Pokemon";
import StatusBox from "./StatusBox";
import levenshtein from "./levenshtein";


const points = {
    CORRECT: 10,
    WRONG: -0,
    CLOSE: -0,
    SKIP: -5,
    REVEAL: -2,
    GEN_CLUE: -2,
    EVO_CLUE: -4,

    START: 5,
};

const COUNTDOWN_TIME = 4000;  // allows a second of "GO!"
const GAME_TIME = 60000;

const fps = 10;
const tickInterval = 1000 / fps;  // milliseconds


class GameScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,

            pokemon: null,

            hidden: true,

            currentGuess: '',
            potentials: props.pokes,

            points: points.START,

            startTime: null,
            elapsedTime: 0,
        };

        this.randPoke = this.randPoke.bind(this);
    }

    componentDidMount() {
        this.setState({
            loading: false,
            startTime: Date.now(),
            pokemon: this.randPoke(),
        });

        this.tickTimerID = setInterval(
            () => { this.tick(); },
            tickInterval,
        );
    }

    componentWillUnmount() {
        clearInterval(this.tickTimerID);
    }

    tick() {
        this.setState({
            elapsedTime: Date.now() - this.state.startTime,
        });
    }

    randPokeFromPotentials(potentials) {
        const n = potentials.length,
            i = Math.floor(Math.random() * n),
            newPoke = potentials[i];

        potentials = [
            ...potentials.slice(0, i),
            ...potentials.slice(i + 1, n),
        ];

        return {
            newPoke,
            potentials,
        };
    }

    randPoke() {
        // TODO: What if empty
        let {newPoke, potentials} = this.randPokeFromPotentials(this.state.potentials);

        this.setState({potentials});
        return newPoke;
    }

    onChange(e) {
        this.setState({
            currentGuess: e.target.value,
            // status: null,
        });
    }

    clean(s) {
        return s.toLowerCase().replace(/[^a-z]/g, '');
    }

    onSubmit() {
        const guess = this.clean(this.state.currentGuess);
        const target = this.clean(this.state.pokemon.name);

        if (guess === target) {
            this.setState((prevState) => ({
                points: prevState.points + points.CORRECT,
                hidden: false,
                // status: "correct",
            }));

            setTimeout(
                () => {
                    this.setState({
                        hidden: true,
                        currentGuess: '',
                        pokemon: this.randPoke(),
                        // status: null,
                    });
                    this.guessInput.focus();
                },
                500,
            );
        } else if (levenshtein(guess, target) <= 2) {
            this.setState((prevState) => ({
                // status: "close",
                points: prevState.points + points.CLOSE,
            }));
        } else {
            this.setState((prevState) => ({
                // status: "nope",
                points: prevState.points + points.WRONG,
            }));
        }
    }

    onKeyUp(e) {
        if (e.key === "Enter") {
            this.onSubmit();
        }
    }

    render() {
        const TimeRemaining = (props) =>
            props.timeRemaining > 0 && <h1>{Math.floor(props.timeRemaining / 1000)}</h1>
        ;

        let body;

        if (this.state.elapsedTime < (COUNTDOWN_TIME)) {
            // prepare
            body = <Col>
                <h1>{Math.floor((COUNTDOWN_TIME - this.state.elapsedTime) / 1000) || "GO"}!</h1>
            </Col>;
        } else if (this.state.elapsedTime < (COUNTDOWN_TIME + GAME_TIME)) {
            // main game
            body = <Col xs={8}>
                {this.state.loading ? null :
                    <Pokemon
                        {...this.state.pokemon}
                        hidden={this.state.hidden}
                        zoom={6}
                    />}
            </Col>;
        } else {
            // game over
            body = <Col>
                <h1>GAME OVER!</h1>
            </Col>;
        }

        return <div>
            <Row>
                <Col xs={3}>
                    <h2>{this.state.points} point{this.state.points === 1 ? "" : "s"}!</h2>
                </Col>
                <Col xs={6}/>
                <TimeRemaining
                    timeRemaining={GAME_TIME - (this.state.elapsedTime - COUNTDOWN_TIME)}
                />
            </Row>
            <Row>
                {body}
                <Col xs={2}>
                    {this.state.status ?
                        <StatusBox option={this.state.status}/> :
                        null}
                </Col>
            </Row>
            <Row>
                <Col xs={4}>
                    <FormGroup validationState={null}>
                        <FormControl
                            type="text"
                            value={this.state.currentGuess}
                            placeholder="Your guess"
                            inputRef={(input) => {
                                this.guessInput = input;
                            }}
                            onChange={this.onChange.bind(this)}
                            onKeyUp={this.onKeyUp.bind(this)}
                            disabled={!this.state.hidden}
                        />
                    </FormGroup>
                </Col>
                <Col xs={2}>
                    <Button
                        type="submit"
                        onClick={this.onSubmit.bind(this)}
                    >
                        Guess
                    </Button>
                </Col>
            </Row>
        </div>;
    }
}

GameScreen.propTypes = {
    goToScreen: PropTypes.func.isRequired,
    screens: PropTypes.object.isRequired,

    pokes: PropTypes.array.isRequired,
};

export default GameScreen;
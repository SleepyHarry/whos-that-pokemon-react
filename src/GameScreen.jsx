import React, {Component} from "react";
import PropTypes from "prop-types";
import {Button, Col, FormControl, FormGroup, Row} from "react-bootstrap";
import Pokemon from "./Pokemon";
import StatusBox from "./StatusBox";
import levenshtein from "./levenshtein";


const points = {
    MAX_CORRECT: 10000,
    CLOSE_MODIFIER: 0.5,
    DECAY_FUNC: t => Math.exp(-(t/5000)),
};

const phases = {
    PREP: Symbol('prep'),
    GAME: Symbol('game'),
    DONE: Symbol('done'),
};

const COUNTDOWN_TIME = 4000;  // allows a second of "GO!"
const GAME_TIME = 6000;

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

            points: 0,

            startTime: null,
            elapsedTime: 0,
            lastGuessTime: null,

            initials: '',
        };

        this.randPoke = this.randPoke.bind(this);
    }

    componentDidMount() {
        const now = Date.now();

        this.setState({
            loading: false,
            startTime: now,
            lastGuessTime: now + COUNTDOWN_TIME,
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

    onPokeChange(e) {
        this.setState({
            currentGuess: e.target.value,
            // status: null,
        });
    }

    clean(s) {
        return s.toLowerCase().replace(/[^a-z]/g, '');
    }

    calcScore(modifier=1) {
        const timeDiff = Date.now() - this.state.lastGuessTime;

        return Math.floor(modifier * (points.DECAY_FUNC(timeDiff) * points.MAX_CORRECT));
    }

    onPokeSubmit() {
        const guess = this.clean(this.state.currentGuess);
        const target = this.clean(this.state.pokemon.name);

        if (levenshtein(guess, target) <= 2) {  // close to correct
            const correct = guess === target;

            this.setState((prevState) => ({
                points: prevState.points + this.calcScore(correct ? 1 : points.CLOSE_MODIFIER),
                hidden: false,
                lastGuessTime: Date.now(),
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
        }
    }

    onPokeKeyUp(e) {
        if (e.key === "Enter") {
            this.onPokeSubmit();
        }
    }

    onInitialsChange(e) {
        this.setState({initials: e.target.value});
    }

    onInitialsSubmit() {
        this.props.submitScore({
            initials: this.state.initials,
            points: this.state.points,
        });

        this.props.goToScreen(
            this.props.screens.START,
            {
                generation: null,
            },
        );
    }

    onInitialsKeyUp(e) {
        if (e.key === "Enter") {
            this.onInitialsSubmit();
        }
    }

    render() {
        const TimeRemaining = (props) =>
            props.timeRemaining > 0 && <h1>{Math.floor(props.timeRemaining / 1000)}</h1>
        ;

        let body;
        let phase;

        // TODO: Move into `willUpdate` or similar
        if (this.state.elapsedTime < (COUNTDOWN_TIME)) {
            // prepare
            phase = phases.PREP;
            body = <Col>
                <h1>{Math.floor((COUNTDOWN_TIME - this.state.elapsedTime) / 1000) || "GO"}!</h1>
            </Col>;
        } else if (this.state.elapsedTime < (COUNTDOWN_TIME + GAME_TIME)) {
            // main game
            phase = phases.GAME;
            body = <div>
                <Row>
                    <Col xs={8}>
                        {this.state.loading ? null :
                            <Pokemon
                                {...this.state.pokemon}
                                hidden={this.state.hidden}
                                zoom={6}
                            />}
                    </Col>
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
                                onChange={this.onPokeChange.bind(this)}
                                onKeyUp={this.onPokeKeyUp.bind(this)}
                                disabled={!this.state.hidden}
                            />
                        </FormGroup>
                    </Col>
                    <Col xs={2}>
                        <Button
                            type="submit"
                            onClick={this.onPokeSubmit.bind(this)}
                        >
                            Guess
                        </Button>
                    </Col>
                </Row>
            </div>;
        } else {
            // game over
            phase = phases.DONE;
            clearInterval(this.tickTimerID);

            body = <div>
                <Row>
                    <Col>
                        <h1>GAME OVER!</h1>
                    </Col>
                </Row>
                <Row>
                    <Col xs={4}>
                        <FormGroup validationState={null}>
                            <FormControl
                                type="text"
                                value={this.state.initials}
                                placeholder="Your initials"
                                inputRef={(input) => {
                                    this.initialsInput = input;
                                }}
                                onChange={this.onInitialsChange.bind(this)}
                                onKeyUp={this.onInitialsKeyUp.bind(this)}
                            />
                        </FormGroup>
                    </Col>
                    <Col xs={2}>
                        <Button
                            type="submit"
                            onClick={this.onInitialsSubmit.bind(this)}
                        >
                            Guess
                        </Button>
                    </Col>
                </Row>
            </div>;
        }

        return <div>
            <Row>
                <Col xs={3}>
                    <h2>{this.state.points} point{this.state.points === 1 ? "" : "s"}!</h2>
                </Col>
                <Col xs={3}/>
                <Col xs={3}>
                    Could get: {this.calcScore()}
                </Col>
                <Col xs={3}>
                    <TimeRemaining
                        timeRemaining={GAME_TIME - (this.state.elapsedTime - COUNTDOWN_TIME)}
                    />
                </Col>
            </Row>
            {body}
        </div>;
    }
}

GameScreen.propTypes = {
    goToScreen: PropTypes.func.isRequired,
    screens: PropTypes.object.isRequired,

    pokes: PropTypes.array.isRequired,

    submitScore: PropTypes.func.isRequired,
};

export default GameScreen;
import React, {Component} from "react";
import PropTypes from "prop-types";
import {Col, FormControl, FormGroup} from "react-bootstrap";
import Pokemon from "./Pokemon";
import levenshtein from "./levenshtein";
import WtpTitle from "./WtpTitle";
import Score from "./Score";

import "./App.css";
import ClockBar from "./ClockBar";
import GuessHistory from "./GuessHistory";
import colours from "./colours";
import InitialsInput from "./InitialsInput";
import ArcadeButton from "./ArcadeButton";


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
const GAME_TIME = 60000;

const fps = 10;
const tickInterval = 1000 / fps;  // milliseconds


class GameScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            phase: phases.PREP,

            pokemon: null,

            hidden: true,

            currentGuess: '',
            potentials: props.pokes,

            points: 0,

            startTime: null,
            elapsedTime: 0,
            lastGuessTime: null,
            guessHistory: [],

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

    componentDidUpdate(prevProps, prevState) {
        if (prevState.phase === phases.PREP && this.state.phase === phases.GAME) {
            // just started the game
            this.guessInput.focus();
        }
    }

    componentWillUnmount() {
        clearInterval(this.tickTimerID);
    }

    tick() {
        let elapsedTime = Date.now() - this.state.startTime;

        if (this.state.currentGuess === "__end__") {
            // useful override for dev. Ends game.
            elapsedTime = COUNTDOWN_TIME + GAME_TIME;
        }

        // calculate phase
        let phase;
        if (elapsedTime < (COUNTDOWN_TIME)) {
            // prepare
            phase = phases.PREP;
        } else if (elapsedTime < (COUNTDOWN_TIME + GAME_TIME)) {
            // main game
            phase = phases.GAME;
        } else {
            // game over
            phase = phases.DONE;
        }

        this.setState({
            phase,
            elapsedTime,
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

        const close = levenshtein(guess, target) <= 2;
        const correct = guess === target;

        let additionalPoints;
        if (!close) {
            additionalPoints = 0
        } else {
            additionalPoints = this.calcScore(correct ? 1 : points.CLOSE_MODIFIER);
        }

        this.setState((prevState) => ({
            points: prevState.points + additionalPoints,
            hidden: false,
            lastGuessTime: Date.now(),
            guessHistory: [
                {
                    pokemon: this.state.pokemon,
                    points: additionalPoints,
                    correct,
                    close,
                },
                ...prevState.guessHistory,
            ],
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

    onPokeKeyUp(e) {
        if (e.key === "Enter") {
            this.onPokeSubmit();
        }
    }

    onInitialsSubmit(initials) {
        this.props.submitScore({
            initials: initials,
            points: this.state.points,
        });

        this.props.goToScreen(
            this.props.screens.START,
            {
                generation: null,
            },
        );
    }

    render() {
        const TimeRemaining = (props) => {
            let color;
            if (props.timeRemaining < 31000) color = colours.amber;
            if (props.timeRemaining < 11000) color = colours.red;

            return <span className="time-remaining" style={{color}}>
                {Math.max(0, Math.floor(props.timeRemaining / 1000))}
            </span>;
        };

        let body;
        switch (this.state.phase) {
            case phases.PREP:
                body = <div>
                    <Col className="centre-content main-content">
                        <h1>{Math.floor((COUNTDOWN_TIME - this.state.elapsedTime) / 1000) || "GO"}!</h1>
                    </Col>
                </div>;
                break;
            case phases.GAME:
                body = <div>
                    <Col>
                        {this.state.loading ? null :
                            <Pokemon
                                {...this.state.pokemon}
                                hidden={this.state.hidden}
                                zoom={6}
                            />}
                    </Col>
                    <Col xs={4} xsOffset={1}>
                        <FormGroup>
                            <FormControl
                                key="guess-input"
                                className="guess-input"
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
                        <ArcadeButton
                            type="submit"
                            onClick={this.onPokeSubmit.bind(this)}
                        >
                            Guess
                        </ArcadeButton>
                    </Col>
                </div>;
                break;
            case phases.DONE:
                clearInterval(this.tickTimerID);

                body = <div>
                    <Col id="game-done" className="centre-content main-content">
                        <div className="spacer" />
                        <h1 style={{color: colours.red}}>TIME UP!</h1>
                    {/*</Col>*/}
                    {/*<Col xs={4}>*/}
                        <FormGroup>
                            <FormControl
                                key="initials-input"
                                componentClass={InitialsInput}
                                submit={this.onInitialsSubmit.bind(this)}
                            />
                        </FormGroup>
                    </Col>
                </div>;
                break;
            default:
                console.error('Unknown game phase!');
                break;
        }

        const timeRemaining = GAME_TIME - Math.max(0, this.state.elapsedTime - COUNTDOWN_TIME);

        const className = {
            [phases.GAME]: "in-game",
            [phases.DONE]: "ended",
        }[this.state.phase] || "";

        return <div id="game-screen" className={className}>
            <WtpTitle size="small" />
            {body}
            <Col xs={3} style={{float: "right"}}>
                <div className="centre-content">
                    <TimeRemaining
                        timeRemaining={timeRemaining}
                    />
                </div>
                <div className="centre-content">
                    <ClockBar
                        timeRemaining={timeRemaining}
                        maxTime={GAME_TIME}
                    />
                </div>
                <div className="centre-content">
                    <Score className="score score-main" score={this.state.points} length={6}/>
                </div>
                <div className="centre-content">
                    <GuessHistory guesses={this.state.guessHistory}/>
                </div>
            </Col>
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